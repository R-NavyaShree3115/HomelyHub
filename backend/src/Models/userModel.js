import db from "../utils/db.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxlength: [30, "Name cannot exceed 30 characters"]
        },

        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please enter a valid email"]
        },

        password: {
            type: String,
            required: [true, "Please enter your password"],
            minLength: [6, "Password should be greater than 6 characters"],
            select: false
        },

        passwordConfirm: {
            type: String,
            required: [true, "Please confirm your password"],
            validate: {
                validator: function (el) {
                    return el === this.password;
                },
                message: "Passwords do not match"
            }
        },

        phoneNumber: {
            type: String,
            required: [true, "Please enter your phone number"],
            unique: true,
            validate: [validator.isMobilePhone, "Please enter a valid phone number"],
            trim: true
        },

        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },

        avatar: {
            url: {
                type: String,
                required: true,
                default: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg"
            },
            public_id: {
                type: String,
                required: true,
                default: "default_avatar"
            }
        },

        passwordChangedAt: {
            type: Date
        },

        passwordResetToken: {
            type: String,
            select: false,
            index: true
        },

        passwordResetExpires: {
            type: Date,
            select: false
        }
    },
    {
        timestamps: true
    }
);


// ==================== CORRECT PASSWORD ====================
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};


// ==================== REMOVE SENSITIVE DATA ====================
userSchema.set("toJSON", {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.passwordConfirm;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.__v;

        return ret;
    }
});


// ==================== PASSWORD HASHING ====================
userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) {
        return next();
    }

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;

    next();
});


// ==================== PASSWORD CHANGED CHECK ====================
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {

    if (this.passwordChangedAt) {

        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );

        return JWTTimestamp < changedTimestamp;
    }

    return false;
};


// ==================== CREATE PASSWORD RESET TOKEN ====================
userSchema.methods.createPasswordResetToken = function () {

    const resetToken = crypto
        .randomBytes(32)
        .toString("hex");

    this.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    this.passwordResetExpires =
        Date.now() + 10 * 60 * 1000;

    return resetToken;
};


const User = mongoose.model("User", userSchema);

export { User };