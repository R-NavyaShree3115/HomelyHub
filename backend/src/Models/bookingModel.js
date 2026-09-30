//prior info 
//which property is being booked
//which user is booking the property
//price of the property
//created at date
//paid or not
//from date and to date of the booking
//timestamps for when the booking was created and last updated
import mongoose from "mongoose";

export const bookingSchema = new mongoose.Schema({
    property:{
        type:mongoose.Schema.ObjectId,
        ref:"Property",
        required:[true,"Booking must belong to a property"]
    },
    user:{
        type :mongoose.Schema.ObjectId,
        ref:"User",
        required:[true,"Booking must belomg to a user"]
    },
    price:{
        type:Number,
        required:[true,"Booking must have a price"]
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paid:{
        type:Boolean,
        default:true
    },
    fromDate:{
        type:Date,

    },
    toDate:{
        type:Date,
    },
    guests:{
        type:Number,
    },
    numberOfNights:{
        type:Number,
    },

},
{timestamps:true}
);

bookingSchema.pre(/^find/,function(){
    this.populate("user");
    this.populate({
        path:"property",
        select: "maximumGuests images propertyName address"
    });
    
});

export const Booking = mongoose.model("Booking",bookingSchema);
