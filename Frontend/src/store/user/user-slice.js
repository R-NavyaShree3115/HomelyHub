import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: "user",

    initialState: {
        isAuthenticated: false,
        loading: false,
        error: null,
        errors: null,
        user: null,
        success: false
    },

    reducers: {

        // ==================== SIGNUP ====================
        getSignupRequest(state) {
            state.loading = true;
        },

        getSignupDetails(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },


        // ==================== LOGIN ====================
        getLoginRequest(state) {
            state.loading = true;
        },

        getLoginDetails(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },


        // ==================== ERROR ====================
        getError(state, action) {
            const message = action.payload;
            state.error = message;
            state.errors = message;
            state.loading = false;
        },


        // ==================== CURRENT USER ====================
        getCurrentRequest(state) {
            state.loading = true;
        },

        getCurrentUser(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        },


        // ==================== UPDATE USER ====================
        getUpdateUserRequest(state) {
            state.loading = true;
        },


        // ==================== LOGOUT ====================
        getLogoutRequest(state) {
            state.loading = true;
        },

        getLogout(state, action) {
            state.user = action.payload;
            state.isAuthenticated = false;
            state.loading = false;
        },


        // ==================== PASSWORD ====================
        getPasswordRequest(state) {
            state.loading = true;
        },

        getPasswordSuccess(state, action) {
            state.success = action.payload;
            state.loading = false;
        },


        // ==================== CLEAR ERRORS ====================
        clearErrors(state) {
            state.error = null;
            state.errors = null;
        }
    }
});

export const userActions = userSlice.actions;