import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbconnected = async () => {
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

}


export default dbconnected;