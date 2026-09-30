import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

// Fetch details of one specific property using its ID
export const getPropertyDetails = (id) => async (dispatch) => {
    try {
        console.log("========== PROPERTY DETAILS API STARTED ==========");
        console.log("PROPERTY ID:", id);

        // Start loading
        dispatch(
            propertyDetailsAction.getListRequest()
        );

        // Call backend API
        const response = await axiosInstance.get(
            `/v1/rent/property/${id}`
        );

        console.log("========== PROPERTY DETAILS API SUCCESS ==========");
        console.log("RESPONSE:", response.data);

        // Check response
        if (!response || !response.data) {
            throw new Error("Could not fetch property details");
        }

        // Backend response:
        // {
        //   status: "success",
        //   data: {...}
        // }

        const { data } = response.data;

        console.log("PROPERTY DETAILS:", data);

        // Store property details in Redux
        dispatch(
            propertyDetailsAction.getPropertyDetails(data)
        );

    } catch (error) {
        console.log("========== PROPERTY DETAILS API ERROR ==========");
        console.log("ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        console.log("MESSAGE:", error.response?.data?.message);

        dispatch(
            propertyDetailsAction.getErrors(
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Could not fetch property details"
            )
        );
    }
};