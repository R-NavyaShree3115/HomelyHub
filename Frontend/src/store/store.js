import { configureStore } from "@reduxjs/toolkit";

import propertySlice from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import { userSlice } from "./user/user-slice";
import bookingSlice from "./Booking/booking-action";

export const store = configureStore({
    reducer: {
        properties: propertySlice.reducer,

        propertyDetailsSlice: propertyDetailsSlice.reducer,

        user: userSlice.reducer,

        booking: bookingSlice.reducer
    }
});