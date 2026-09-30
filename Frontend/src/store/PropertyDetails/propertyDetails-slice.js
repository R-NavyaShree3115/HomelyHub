import { createSlice } from "@reduxjs/toolkit";

const propertyDetailsSlice = createSlice({

    name: "propertyDetails",

    initialState: {
        propertyDetails: null,
        loading: false,
        error: null
    },

    reducers: {

        // =========================
        // REQUEST STARTED
        // =========================
        getListRequest(state) {
            state.loading = true;
            state.error = null;
        },

        // =========================
        // PROPERTY DETAILS RECEIVED
        // =========================
        getPropertyDetails(state, action) {
            state.propertyDetails = action.payload;
            state.loading = false;
            state.error = null;
        },

        // =========================
        // ERROR
        // =========================
        getErrors(state, action) {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const propertyDetailsAction =
    propertyDetailsSlice.actions;

export default propertyDetailsSlice;