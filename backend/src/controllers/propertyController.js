// get all properties
// get property based on id


import { Property } from "../Models/propertyModel.js";
import { APIFeatures } from "../utils/APIFeatures.js";
import getImageKitClient from "../utils/ImagekitIO.js";


// get all properties

const getProperties = async(req,res)=>{
    try{
      const features = new APIFeatures(Property.find(),req.query)
      .filter()
      .search()
      .paginate();

      const [doc, allProperties] = await Promise.all([
        features.query,
        Property.countDocuments(),
      ]);

      res.status(200).json({
        status:"success",
        no_of_responses: doc.length,
        all_properties: allProperties,
        data:doc
      })
    }catch(error){
        console.error("Error searching properties: ", error)
        res.status(500).json({status:"fail", message:"Unable to fetch properties"})
    }
}

//get property by id
// http://localhost:8080/api/v1/rent/listing/:id
//http://localhost:8080/api/v1/rent/listing/666476848
// req.params.id

const getProperty = async(req,res)=>{
    try{
       const property = await Property.findById(req.params.id);
       if (!property) {
         return res.status(404).json({ status: "fail", message: "Property not found" });
       }

       res.status(200).json({
        status:"success",
        data: property,
       })

    }catch(error){
      res.status(404).json({
        status:"fail",
        message:error.message
      })
    }
}

// CREATE A PROPERTY - an owner adds his house

// take the details, upload every photo to ImageKit,
// keep only the links, then save the house with the owner's
// id attached.
// This route has protect on it, so req.user already exists.
const createProperty = async (req, res) => {
  try {
    // Take the fields out of the body one by one. This is the
    // same idea as filterObj - we decide what we accept.
    const {
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest,
      price,
      images,
    } = req.body;

    if (!Array.isArray(images) || images.length < 6) {
      return res.status(400).json({
        status: "fail",
        message: "Please upload at least 6 images",
      });
    }

    // an empty list, we will fill it as each photo goes up
    const uploadedImages = [];

    // Go through the photos one at a time. Each one is sent to
    // ImageKit, which stores the file and hands back a url and
    // an id. The photo itself never enters our database.
    // await inside the loop = wait for this photo, then next.
    for (const [index, image] of images.entries()) {
      if (!image?.url || typeof image.url !== "string") {
        return res.status(400).json({
          status: "fail",
          message: "Each image must include a valid URL or image data",
        });
      }

      const result = await getImageKitClient().upload({
        file: image.url,
        fileName: `property_${Date.now()}_${index}.jpg`,
        folder: "property_images",
      });

      uploadedImages.push({ url: result.url, public_id: result.fileId });
    }
    // Now save the house. Notice images: uploadedImages - the
    // LINKS, not the photos.
    const property = await Property.create({
      propertyName,
      description,
      propertyType,
      roomType,
      extraInfo,
      address,
      amenities,
      checkInTime,
      checkOutTime,
      maximumGuest: Number(maximumGuest),
      price: Number(price),
      images: uploadedImages,
      // The owner comes from the token, NOT from req.body.
      // If we trusted the body, anyone could add a house under
      // someone else's name.
      userId: req.user._id,
    });

    res.status(201).json({ status: "success", data: { data: property } });
  } catch (error) {
    console.error("Error creating property", error);
    res.status(error.code === "IMAGEKIT_NOT_CONFIGURED" ? 503 : 400).json({
      status: "fail",
      message: error.code === "IMAGEKIT_NOT_CONFIGURED"
        ? "Image uploads are not configured. Please contact the service owner."
        : error.message,
    });
  }
};

// GET MY PROPERTIES - the owner's own dashboard
// find every house whose userId is me.
const getUsersProperties = async (req, res) => {
  try {
    // again from the token, so a user can only ever see his own
    const userId = req.user._id;
    // find (not findById) because he may own many houses.
    // { userId } is short for { userId: userId }.
    const property = await Property.find({ userId });
    res.status(200).json({
      status: "success",
      data: property,
    });
  } catch (error) {
    res.status(404).json({ status: "fail", message: error.message });
  }
};


export{
    getProperties,
    getProperty,
    createProperty,
    getUsersProperties
}