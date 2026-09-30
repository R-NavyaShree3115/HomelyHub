//manage bookings

//store all bookings
//store individual booking details
///track the api status
//add new bookings when it is created
//updating the booking data when we recv it from backend

import { createSlice } from "@reduxjs/toolkit";

const bookingSlice =createSlice({
    name:"booking",
    initialState:{
        bookings:[],
        bookingDetails:{},
        loading :false
    },
    reducers:{
        setBookingRequest(state){
            state.loading = true

        },
        setBookings(state,action){
            state.bookings=action.payload,
            state.loading = false
        },
        addBooking(state,action){
            state.bookings.push(action.payload)
        },
        setBookingDetails(state,action){
            state.bookingDetails = action.payload.bookings;
        }
    }
})
export const {setBookings,addBooking,setBookingDetails}=bookingSlice.actions;
export default bookingSlice;