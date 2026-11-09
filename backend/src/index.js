import express from 'express';//import library
import dotenv from "dotenv";//import library to load environment variables from .env file
import cors from "cors";//handles cross-origin requests
import cookieparser from "cookie-parser";//parses cookies attached to the client request object
import mongoose from "mongoose";//import mongoose for health-check
import { createTripPlan } from "./controllers/tripController.js";//import createTripPlan from tripController.js
import {propertyRouter} from "./routes/propertyRouter.js";//import the router from propertyRouter.js
import { bookingRouter } from './routes/bookingRouter.js';
import connectDB from "./utils/db.js";//import the connectDB function to establish a connection to the MongoDB database
import {router} from "./routes/userRoutes.js";//import the router from userRoutes.js



dotenv.config();//load environment variables from .env file
dotenv.config({ path: "/etc/secrets/.env" });

const app=express();//create an instance of the express application

const allowedOrigins = new Set(
    (process.env.FRONTEND_URL || "https://myprojecthomelyhub.netlify.app")
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean)
);

app.use(cors({
    origin(origin, callback) {
        const localOrigin = process.env.NODE_ENV !== "production" &&
            /^http:\/\/localhost:(5173|4173)$/.test(origin || "");
        if (!origin || allowedOrigins.has(origin) || localOrigin) {
            return callback(null, true);
        }
        return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
}));

app.use(express.json({ limit: "25mb" }));

app.use(express.urlencoded({ extended: true, limit: "25mb" }));

app.use(cookieparser());//middleware to parse cookies attached to the client request object

app.get('/',(req,res)=>{
    res.send("Homely server is running");
})
app.get("/health", (_req, res) => {
    const databaseReady = mongoose.connection.readyState === 1;
    res.status(databaseReady ? 200 : 503).json({
        status: databaseReady ? "ok" : "not_ready",
        database: databaseReady ? "connected" : "disconnected",
    });
});

app.use("/api/v1/rent/user", router);//mount the router on the /api/v1/user path
app.use("/api/v1/rent/property", propertyRouter);//mount the router on the /api/v1/property path
app.use("/api/v1/rent/user/booking",bookingRouter);
app.post("/api/v1/rent/trip", createTripPlan);

app.use((req, res) => {
    res.status(404).json({ status: "fail", message: "Route not found" });
});

const startServer = async () => {
    await connectDB();
    const port = Number(process.env.PORT) || 8080;
    app.listen(port, () => {
        console.log(`Homely API listening on port ${port}`);
    });
};

startServer().catch((error) => {
    console.error("Unable to start Homely API:", error.message);
    process.exitCode = 1;
});

//process.exit(0)-->prog. ended successfully
//process.exit(1)-->prog. ended with error
//process.exit()-->stops the Node.js process immediately