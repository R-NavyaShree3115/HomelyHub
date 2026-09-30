import express from 'express';//import library
import dotenv from "dotenv";//import library to load environment variables from .env file
import cors from "cors";//handles cross-origin requests
import cookieparser from "cookie-parser";//parses cookies attached to the client request object
import {propertyRouter} from "./routes/propertyRouter.js";//import the router from propertyRouter.js
import { bookingRouter } from './routes/bookingRouter.js';
import connectDB from "./utils/db.js";//import the connectDB function to establish a connection to the MongoDB database
import {router} from "./routes/userRoutes.js";//import the router from userRoutes.js



dotenv.config();//load environment variables from .env file

const app=express();//create an instance of the express application

app.use(express.json({limit:"100mb"}));//middleware to parse incoming JSON requests

app.use(express.urlencoded({extended:true,limit:"100mb"}));//middleware to parse incoming URL-encoded requests

app.use(cookieparser());//middleware to parse cookies attached to the client request object

const PORT= process.env.PORT; //define the port number on which the server will listen
//one test route
app.get('/',(req,res)=>{
    res.send("Homely server is running");
})

app.use("/api/v1/rent/user", router);//mount the router on the /api/v1/user path
app.use("/api/v1/rent/property", propertyRouter);//mount the router on the /api/v1/property path
app.use("/api/v1/rent/user/booking",bookingRouter);
connectDB();//establish a connection to the MongoDB database

app.listen(PORT,()=>{
    console.log(`App is running  on the port http://localhost:${PORT}`);
    
})

//process.exit(0)-->prog. ended successfully
//process.exit(1)-->prog. ended with error
//process.exit()-->stops the Node.js process immediately