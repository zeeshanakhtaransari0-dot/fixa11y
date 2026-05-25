import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import authMiddleware from "./middleware/authMiddleware.js";
import scanRoutes from "./routes/scan.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/scan", scanRoutes);
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Protected data accessed",
    user: req.user,
  });
});

app.get("/", (req, res) => {
  res.send("Server + DB running 🚀");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => console.log("DB Error:", err));