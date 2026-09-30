// authController.js
// signup / login / logout / protect / updateMe / updatePassword
// forgotPassword / resetPassword / check

import { User } from "../Models/userModel.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import imagekit from "../utils/ImagekitIO.js";
import {
  forgotPasswordMailGenContent,
  sendMail,
} from "../utils/mail.js";

import {
  createSendToken,
  defaultAvatarUrl,
  filterObj,
} from "../utils/token.js";


// =====================================================
// 1. SIGNUP
// =====================================================

const signup = async (req, res) => {
  try {
    const avatarInput = req.body.avatar;
    const avatarFallback = {
      url: defaultAvatarUrl(req.body.name),
      public_id: `default_avatar_${(req.body.name || "User")
        .trim()
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase() || "US"}`,
    };

    const safeAvatar =
      avatarInput && typeof avatarInput === "object"
        ? {
            url: avatarInput.url || avatarFallback.url,
            public_id: avatarInput.public_id || avatarFallback.public_id,
          }
        : avatarFallback;

    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      avatar: safeAvatar,
    });

    createSendToken(newUser, 201, res);

  } catch (error) {

    const duplicatedField =
      Object.keys(error.keyPattern || {})[0];

    const message = duplicatedField
      ? `An account with that ${duplicatedField} already exists`
      : error.message;

    res.status(400).json({
      status: "fail",
      message,
    });
  }
};


// =====================================================
// 2. LOGIN
// =====================================================

const login = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Please Provide email and password");
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (
      !user ||
      !(await user.correctPassword(password, user.password))
    ) {
      throw new Error("Incorrect email or password");
    }

    createSendToken(user, 200, res);

  } catch (error) {

    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};


// =====================================================
// 3. LOGOUT
// =====================================================

const logout = (req, res) => {

  const cookieOptions = {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  };

  if (process.env.NODE_ENV === "production") {

    cookieOptions.sameSite = "none";
    cookieOptions.secure = true;

  } else {

    cookieOptions.sameSite = "lax";
    cookieOptions.secure = false;
  }

  res.cookie(
    "jwt",
    "loggedout",
    cookieOptions
  );

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};


// =====================================================
// 4. PROTECT
// =====================================================

const protect = async (req, res, next) => {

  try {

    let token;

    // Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {

      token =
        req.headers.authorization.split(" ")[1];

    }

    // Cookie
    else if (
      req.cookies.jwt &&
      req.cookies.jwt !== "loggedout"
    ) {

      token = req.cookies.jwt;
    }


    // No token
    if (!token) {

      throw new Error(
        "You are not logged in!! Please login to access"
      );
    }


    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );


    // Find user
    const currentUser =
      await User.findById(decoded.id);

    if (!currentUser) {

      throw new Error(
        "The user belonging to the token doesn't exist"
      );
    }


    // Check password change
    if (
      currentUser.changedPasswordAfter(
        decoded.iat
      )
    ) {

      throw new Error(
        "User recently changed the password, Please login again"
      );
    }


    // Attach user
    req.user = currentUser;

    next();

  } catch (error) {

    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
};


// =====================================================
// 5. UPDATE ME
// =====================================================

const updateMe = async (req, res) => {

  try {

    const filteredBody = filterObj(
      req.body,
      "name",
      "phoneNumber",
      "avatar"
    );


    const sentPhoto =
      req.body.avatar !== undefined &&
      String(req.body.avatar).trim() !== "";


    const currentAvatarUrl =
      (req.user.avatar &&
        req.user.avatar.url) ||
      "";


    const usingInitials =
      currentAvatarUrl.includes(
        "ui-avatars.com"
      );


    // User uploaded a new photo
    if (sentPhoto) {

      const uploadResponse =
        await imagekit.upload({
          file: req.body.avatar,
          fileName: `avatar_${Date.now()}.jpg`,
          folder: "avatars",
        });


      filteredBody.avatar = {
        public_id: uploadResponse.fileId,
        url: uploadResponse.url,
      };
    }


    // No photo, but need default avatar
    else if (
      req.body.avatar !== undefined ||
      (filteredBody.name && usingInitials)
    ) {

      filteredBody.avatar = {
        public_id: "default_avatar",
        url: defaultAvatarUrl(
          filteredBody.name ||
          req.user.name
        ),
      };
    }


    // Don't change avatar
    else {

      delete filteredBody.avatar;
    }


    const updateUser =
      await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
          new: true,
          runValidators: true,
        }
      );


    res.status(200).json({
      status: "Success",
      data: {
        user: updateUser,
      },
    });

  } catch (error) {

    res.status(400).json({
      status: "Fail",
      message: error.message,
    });
  }
};


// =====================================================
// 6. UPDATE PASSWORD
// =====================================================

const updatePassword = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      ).select("+password");


    if (
      !(await user.correctPassword(
        req.body.passwordCurrent,
        user.password
      ))
    ) {

      const authError =
        new Error(
          "Your current password is wrong"
        );

      authError.statusCode = 401;

      throw authError;
    }


    user.password =
      req.body.password;

    user.passwordConfirm =
      req.body.passwordConfirm;


    await user.save();


    createSendToken(
      user,
      200,
      res
    );

  } catch (error) {

    res.status(
      error.statusCode || 400
    ).json({
      status: "fail",
      message: error.message,
    });
  }
};


// =====================================================
// 7. FORGOT PASSWORD
// =====================================================

const forgotPassword = async (req, res) => {

  const genericResponse = {
    status: "success",
    message:
      "If that email is registered, a reset link has been sent",
  };


  try {

    const user =
      await User.findOne({
        email: req.body.email,
      });


    if (!user) {

      return res
        .status(200)
        .json(genericResponse);
    }


    const resetToken =
      user.createPasswordResetToken();


    await user.save({
      validateBeforeSave: false,
    });


    const resetURL =
      `${process.env.ORIGIN_ACCESS_URL}/user/resetPassword/${resetToken}`;


    try {

      await sendMail({
        email: user.email,
        subject:
          "Reset your Password (valid for 10 mins)",

        mailGenContent:
          forgotPasswordMailGenContent(
            user.name,
            resetURL
          ),
      });

    } catch (mailError) {

      const userWithToken =
        await User.findById(
          user._id
        ).select(
          "+passwordResetToken +passwordResetExpires"
        );


      userWithToken.passwordResetToken =
        undefined;

      userWithToken.passwordResetExpires =
        undefined;


      await userWithToken.save({
        validateBeforeSave: false,
      });


      throw mailError;
    }


    res
      .status(200)
      .json(genericResponse);

  } catch (error) {

    console.error(
      "forgotPassword failed:",
      error
    );

    res.status(500).json({
      status: "fail",
      message:
        "Could not send the reset email, please try again later",
    });
  }
};


// =====================================================
// 8. RESET PASSWORD
// =====================================================

const resetPassword = async (req, res) => {

  try {

    const hashedToken =
      crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");


    const user =
      await User.findOne({
        passwordResetToken:
          hashedToken,

        passwordResetExpires: {
          $gt: Date.now(),
        },
      }).select(
        "+passwordResetToken +passwordResetExpires"
      );


    if (!user) {

      throw new Error(
        "Token is invalid or expired"
      );
    }


    user.password =
      req.body.password;

    user.passwordConfirm =
      req.body.passwordConfirm;


    user.passwordResetToken =
      undefined;

    user.passwordResetExpires =
      undefined;


    await user.save();


    createSendToken(
      user,
      200,
      res
    );

  } catch (error) {

    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


// =====================================================
// 9. CHECK CURRENT USER
// =====================================================

const check = async (req, res) => {

  try {

    res.status(200).json({
      status: "success",
      message: "Logged In",
      user: req.user,
    });

  } catch (error) {

    res.status(400).json({
      status: "fail",
      message: "UnAuthorised",
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

export {
  signup,
  login,
  logout,
  protect,
  updateMe,
  resetPassword,
  forgotPassword,
  updatePassword,
  check,
};