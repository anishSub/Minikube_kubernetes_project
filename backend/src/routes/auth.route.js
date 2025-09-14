// api/controllers/auth.controller.js
import { User } from "../models/user.model.js"; // Adjust based on your model
import bcrypt from "bcryptjs"; // Example dependency
import jwt from "jsonwebtoken"; // Example dependency

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate JWT (example)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response
    return res.status(200).json({ success: true, token, user: { id: user._id, email: user.email } });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
