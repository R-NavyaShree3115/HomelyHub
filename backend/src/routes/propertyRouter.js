import express from "express";
import {
	createProperty,
	getProperties,
	getProperty,
	getUsersProperties,
} from "../controllers/propertyController.js";
import { protect } from "../controllers/authController.js";

const propertyRouter = express.Router();

propertyRouter.route("/").get(getProperties).post(protect, createProperty);
propertyRouter.get("/mine", protect, getUsersProperties);
propertyRouter.route("/:id").get(getProperty);

export {propertyRouter};