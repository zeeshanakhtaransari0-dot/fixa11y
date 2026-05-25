import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
        console.log(req.body);
    const { name, email, password } = req.body;
    

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // create new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User created successfully",
      user,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // compare password
const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(400).json({ message: "Invalid password" });
}

// create token
const token = jwt.sign(
  { id: user._id },
  "secretkey",
  { expiresIn: "1d" }
);

res.json({
  message: "Login successful",
  token,
});

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;