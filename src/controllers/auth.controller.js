const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Logged in successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// --------------------- ADMIN SIGNIN ---------------------
exports.adminSignin = async (req, res) => {
  try {
    console.log("=== Admin login attempt ===");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    console.log("User found in DB:", user ? user.email : null);

    if (!user) {
      console.log("No user found with this email");
      return res.status(404).json({ message: "Admin not found" });
    }

    if (user.role !== "admin") {
      console.log(`Access denied. User role is: ${user.role}`);
      return res.status(403).json({ message: "Access denied. Not an admin." });
    }

    const valid = await user.validatePassword(password);
    console.log("Password valid:", valid);

    if (!valid) {
      console.log("Invalid password attempt for admin");
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("Admin login successful. Token generated.");

    res.json({
      message: "Admin logged in successfully",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in adminSignin:", err);
    res.status(500).json({ message: "Server error" });
  }
};
