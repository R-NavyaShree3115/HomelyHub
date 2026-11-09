import slugify from "slugify";
import mongoose from "mongoose";
import validator from "validator";


export const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "Please enter property name"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Please enter property description"],
        trim: true,
    },
    extraInfo: {
        type: String,
        default: "Checkin on time, Checkout on time, No smoking, No pets",
    },
    propertyType: {
        type: String,
        required: [true, "Please enter property type"],
        enum: ["Flat", "House", "Hotel", "Guest House"],
    },
    roomType: {
        type: String,
        enum: ["Anytype", "Room", "Entire Home"],
        default: "Anytype",
    },
    maximumGuest: {
        type: Number,
        required: [true, "Please enter maximum guests"],
        min: 1,
    },
    maximumGuests: Number,
    amenities: [
        {
            name: { type: String, required: true, trim: true },
            icon: { type: String, required: true, trim: true },
        },
    ],
    amenties: [
        {
            name: String,
            icon: String,
        },
    ],
    images: {
        type: [
            {
                public_id: { type: String, required: true },
                url: { type: String, required: true },
            },
        ],
        validate: {
            validator: function (images) {
                return images.length >= 6;
            },
            message: "Please upload at least 6 images",
        },
    },
    price: {
        type: Number,
        required: [true, "Please enter price per night"],
        min: 0,
    },
    pricePerNight: {
        type: Number,
        min: 0,
    },
    address: {
        area: { type: String, required: true, trim: true },
        city: { type: String, required: true, trim: true },
        state: { type: String, required: true, trim: true },
        country: { type: String, trim: true, default: "India" },
        pincode: { type: String, required: true, trim: true },
    },
    currentBookings: [
        {
            bookingId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Booking",
            },
            fromdate:{
                type:Date
            },
            toDate:{
                type:Date
            },
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            },
            
        }
    ],

    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    slug: String,
    checkInTime: {
        type: String,
        default: "11:00",
    },
    checkOutTime: { 
        type: String,   
        default: "13:00 ",
    },
}, { timestamps: true });

// Mongoose middleware to generate slug before saving the property
propertySchema.pre("save", function () {
    if (this.isModified("propertyName")) {
        this.slug = slugify(this.propertyName, { lower: true });
    }
    if (this.price == null && this.pricePerNight != null) {
        this.price = this.pricePerNight;
    }
    if (this.maximumGuest == null && this.maximumGuests != null) {
        this.maximumGuest = this.maximumGuests;
    }
    if (this.amenities.length === 0 && this.amenties.length > 0) {
        this.amenities = this.amenties;
    }
    if (this.address?.city) {
        this.address.city = this.address.city.toLowerCase().replace(/\s+/g, "");
    }
});

// Mongoose middleware to hash the password before saving the user
//const Property =  mongoose.model("Property", propertySchema);
export const Property = mongoose.models.Property || mongoose.model("Property", propertySchema);