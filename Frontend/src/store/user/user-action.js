import { userActions } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

// =====================================================
// SIGNUP
// =====================================================

const createDefaultAvatar = (name = "User") => {
    const initials = (name || "User")
        .trim()
        .replace(/[^a-zA-Z]/g, "")
        .slice(0, 2)
        .toUpperCase() || "US";

    return {
        url: `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=0e8b53&color=fff&size=256&bold=true`,
        public_id: `default_avatar_${initials}`,
    };
};

export const getSignup = (user) => async (dispatch) => {
    try {
        dispatch(userActions.getSignupRequest());

        const payload = {
            ...user,
            avatar: user?.avatar && typeof user.avatar === "object"
                ? {
                    url: typeof user.avatar.url === "string" ? user.avatar.url : createDefaultAvatar(user.name).url,
                    public_id: user.avatar.public_id || createDefaultAvatar(user.name).public_id,
                }
                : createDefaultAvatar(user?.name),
        };

        const { data } = await axiosInstance.post(
            "/v1/rent/user/signup",
            payload
        );

        console.log("========== SIGNUP SUCCESS ==========");
        console.log("DATA:", data);

        dispatch(
            userActions.getSignupDetails(data.user)
        );

    } catch (error) {
        console.log("========== SIGNUP ERROR ==========");
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.response?.data?.message);
        console.log("SENT USER:", user);

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Signup failed"
            )
        );
    }
};


// =====================================================
// LOGIN
// =====================================================

export const getLogin = (user) => async (dispatch) => {
    try {
        dispatch(userActions.getLoginRequest());

        const { data } = await axiosInstance.post(
            "/v1/rent/user/login",
            user
        );

        console.log("========== LOGIN SUCCESS ==========");
        console.log("DATA:", data);

        dispatch(
            userActions.getLoginDetails(data.user)
        );

    } catch (error) {
        console.log("========== LOGIN ERROR ==========");
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.response?.data?.message);
        console.log("SENT USER:", user);

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Login failed"
            )
        );
    }
};


// =====================================================
// CURRENT USER
// =====================================================

export const currentUser = () => async (dispatch) => {
    try {
        dispatch(userActions.getCurrentRequest());

        const { data } = await axiosInstance.get(
            "/v1/rent/user/me"
        );

        console.log("========== CURRENT USER SUCCESS ==========");
        console.log("DATA:", data);

        dispatch(
            userActions.getCurrentUser(data.user)
        );

    } catch (error) {
        console.log("========== CURRENT USER ERROR ==========");
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.response?.data?.message);

        dispatch(
            userActions.getLogout(null)
        );
    }
};


// =====================================================
// UPDATE USER
// =====================================================

export const updateUser = (updateUser) => async (dispatch) => {
    try {
        dispatch(
            userActions.getUpdateUserRequest()
        );

        const response = await axiosInstance.patch(
            "/v1/rent/user/updateMe",
            updateUser
        );

        console.log(
            "========== UPDATE USER SUCCESS =========="
        );
        console.log(
            "RESPONSE:",
            response.data
        );

        // Get updated user
        const { data } = await axiosInstance.get(
            "/v1/rent/user/me"
        );

        dispatch(
            userActions.getCurrentUser(data.user)
        );

    } catch (error) {
        console.log(
            "========== UPDATE USER ERROR =========="
        );
        console.log(
            "STATUS:",
            error.response?.status
        );
        console.log(
            "DATA:",
            error.response?.data
        );
        console.log(
            "MESSAGE:",
            error.response?.data?.message
        );

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Update user failed"
            )
        );
    }
};


// =====================================================
// FORGOT PASSWORD
// =====================================================

export const forgotPassword = (email) => async (dispatch) => {
    try {
        const { data } = await axiosInstance.post(
            "/v1/rent/user/forgotPassword",
            {
                email
            }
        );

        console.log(
            "========== FORGOT PASSWORD SUCCESS =========="
        );
        console.log("DATA:", data);

    } catch (error) {
        console.log(
            "========== FORGOT PASSWORD ERROR =========="
        );
        console.log(
            "STATUS:",
            error.response?.status
        );
        console.log(
            "DATA:",
            error.response?.data
        );
        console.log(
            "MESSAGE:",
            error.response?.data?.message
        );

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Forgot password failed"
            )
        );
    }
};


// =====================================================
// RESET PASSWORD
// =====================================================

export const resetPassword = (
    resetPassword,
    token
) => async (dispatch) => {

    try {
        const { data } = await axiosInstance.patch(
            `/v1/rent/user/resetPassword/${token}`,
            resetPassword
        );

        console.log(
            "========== RESET PASSWORD SUCCESS =========="
        );
        console.log("DATA:", data);

    } catch (error) {
        console.log(
            "========== RESET PASSWORD ERROR =========="
        );
        console.log(
            "STATUS:",
            error.response?.status
        );
        console.log(
            "DATA:",
            error.response?.data
        );
        console.log(
            "MESSAGE:",
            error.response?.data?.message
        );

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Reset password failed"
            )
        );
    }
};


// =====================================================
// UPDATE PASSWORD
// =====================================================

export const updatePassword = (passwords) => async (dispatch) => {
    try {
        dispatch(
            userActions.getPasswordRequest()
        );

        const { data } = await axiosInstance.patch(
            "/v1/rent/user/updatePassword",
            passwords
        );

        console.log(
            "========== UPDATE PASSWORD SUCCESS =========="
        );
        console.log("DATA:", data);

        dispatch(
            userActions.getPasswordSuccess(true)
        );

    } catch (error) {
        console.log(
            "========== UPDATE PASSWORD ERROR =========="
        );
        console.log(
            "STATUS:",
            error.response?.status
        );
        console.log(
            "DATA:",
            error.response?.data
        );
        console.log(
            "MESSAGE:",
            error.response?.data?.message
        );

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Update password failed"
            )
        );
    }
};


// =====================================================
// LOGOUT
// =====================================================

export const logout = () => async (dispatch) => {
    try {
        const { data } = await axiosInstance.get(
            "/v1/rent/user/logout"
        );

        console.log(
            "========== LOGOUT SUCCESS =========="
        );
        console.log("DATA:", data);

        dispatch(
            userActions.getLogout(null)
        );

    } catch (error) {
        console.log(
            "========== LOGOUT ERROR =========="
        );
        console.log(
            "STATUS:",
            error.response?.status
        );
        console.log(
            "DATA:",
            error.response?.data
        );
        console.log(
            "MESSAGE:",
            error.response?.data?.message
        );

        dispatch(
            userActions.getError(
                error.response?.data?.message ||
                "Logout failed"
            )
        );
    }
};