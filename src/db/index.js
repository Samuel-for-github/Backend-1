import mongoose from "mongoose";
import { DB_NAME} from "../constants.js";

const connectDB = async () =>{
    try {
        const response = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        // console.log(response);
        // read about response
        console.log(`\n MongoDB connected DB Host: ${response.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection Error", error);
        process.exit(1)
    }
}

export default connectDB;