// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
import express from 'express'
import connectDB from "./db/index.js";
// require('dotenv').config({path: './env'})
import dotenv from "dotenv"


dotenv.config({
    path: './env'
})

const app = express();

connectDB().then(()=>{
    app.on('error', (error)=>{
        console.log(`Server failed to run on port ${process.env.PORT}`);
        throw error
    })
    app.listen(process.env.PORT || 3000, ()=>{
        console.log(`Server is running at port ${process.env.PORT}`);
    })
}).catch((e)=> console.log("Mongo DB connection Fail", e))






















/*

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error)=>{
            console.log("Error");
            throw error;
        })
        app.listen(process.env.PORT, ()=>{
            console.log(`App is Listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.log("Error: ", error);
        throw error
    }
})()

*/