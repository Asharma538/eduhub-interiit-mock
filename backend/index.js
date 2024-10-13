import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./src/routes/auth.routes.js";
import classRouter from "./src/routes/class.routes.js";
import memberRouter from "./src/routes/member.routes.js";
import assignmentRoutes from "./src/routes/assignment.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 8080;
const URL = process.env.MONGO_URL;

const corsOptions = {
  origin: "http://localhost:5500", // Replace with the allowed URL
  methods: "*", // Allow all HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  credentials: true,
};

// Use the cors middleware with the options
app.use(cors(corsOptions));
app.use(express.json());
app.use(authRouter);
app.use("/classes/:classId", classRouter);
app.use("/classes/:classId", memberRouter);
app.use("/classes/:classId", assignmentRoutes);

mongoose
  .connect(URL)
  .then(() => {
    console.log("connected to db.");

    app.listen(PORT, () => {
      console.log("server running.");
    });
  })
  .catch((err) => {
    console.error("error : ", err);
  });
