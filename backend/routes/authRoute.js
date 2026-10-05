const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken"); // ✅ ADDED THIS
const User = require("../models/User");

const router = express.Router();

// ✅ REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already used
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    // Save new user
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({ userId: user._id, name : user.name, email: user.email });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;