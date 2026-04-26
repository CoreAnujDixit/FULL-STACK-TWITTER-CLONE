import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbconnected from "./utils/db.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/tweets", tweetRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("Twitter Clone API Running 🚀");
});

const PORT = process.env.PORT || 5000;


dbconnected();
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});