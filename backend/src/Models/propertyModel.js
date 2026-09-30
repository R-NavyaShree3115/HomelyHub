import slugify from "slugify";
import mongoose from "mongoose";
import validator from "validator";


export const propertySchema = new mongoose.Schema({
    propertyName: {
        type: String,
        required: [true, "Please enter property name"],
    },
    description: {
        type: String,
        required: [true, "Please enter property description"],
    },
    extraInfo: {
        type: String,
        default: "Checkin on time, Checkout on time, No smoking, No pets",
    },
    propertyType: {
        type: String,
        required: [true, "Please enter property type"],
        enum: {
            values: ["Flat", "house", "Hotel", "Guest house"],
            message: "Property type must be either: Flat, House, Hotel, or Guest house",
            default: "house"
        },
        roomType: {
            type: String,
            enum:{
                values: ["Anytype", "Room", "Entire Home"],
               default: "Anytype"
            },
        },
        maximumGuests: {
            type: Number,
            required: [true, "Please enter maximum guests"],
        },
        amenties:[
            {
                name:{
                    type:String,
                    required:true,
                    enum:["Wifi","TV","Air conditioning","Kitchen","Heating","Washer","Dryer","Free parking on premises","Hot tub","Pool"]
                },
                
                icon:{
                    type:String,
                    required:true
                }
            }
        ],},
        images:{
            type:[
                {
                    public_id:{
                        type:String,
                        required:true
                    },
                    url:{
                        type:String,
                        required:true
                    }
                }
            ],
            validate:{
                validator:function(val){
                    return val.length>6;
                },
                message:"Please upload at least 6 images"
            }
        },
    pricePerNight: {
        type: Number,
        required: [true, "Please enter price per night"],
        default:500
    },
    address: {
        type: String,
        city:String,
        state:String,
        country:String,
        zipCode:String,
        required: [true, "Please enter property address"],
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

})

// Mongoose middleware to generate slug before saving the property
propertySchema.pre("save", function () {
    this.slug = slugify(this.propertyName, { lower: true });
    //next();
});

// Mongoose middleware to convert city name to lowercase and remove spaces before saving the property
propertySchema.pre("save", async function () {
    this.address.city = this.address.city.toLowerCase().replace(" ","");
    //next();
})

// Mongoose middleware to hash the password before saving the user
//const Property =  mongoose.model("Property", propertySchema);
export const Property =mongoose.model.Property || mongoose.model("Property",propertySchema);