const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Enhanced register route with better validation and logging
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  console.log(
    `📝 Registration attempt - Username: ${username}, Email: ${email}`
  );

  if (!username || !email || !password) {
    console.log("❌ Registration failed - Missing fields");
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate input formats
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log("❌ Registration failed - Invalid email format");
    return res
      .status(400)
      .json({ message: "Please enter a valid email address" });
  }

  if (username.length < 3) {
    console.log("❌ Registration failed - Username too short");
    return res
      .status(400)
      .json({ message: "Username must be at least 3 characters long" });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    console.log("❌ Registration failed - Invalid username format");
    return res
      .status(400)
      .json({
        message: "Username can only contain letters, numbers, and underscores",
      });
  }

  if (password.length < 8) {
    console.log("❌ Registration failed - Password too short");
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Normalize email to lowercase for case-insensitive storage and lookup
    const normalizedEmail = email.toLowerCase().trim();
    const trimmedUsername = username.trim();

    // Check for existing user with case-insensitive email and exact username match
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: trimmedUsername }],
    });

    if (existingUser) {
      if (existingUser.email === normalizedEmail) {
        console.log(
          `❌ Registration failed - Email already exists: ${normalizedEmail}`
        );
        return res.status(400).json({ message: "Email already exists" });
      }
      if (existingUser.username === trimmedUsername) {
        console.log(
          `❌ Registration failed - Username already exists: ${trimmedUsername}`
        );
        return res.status(400).json({ message: "Username already exists" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12); // Increased salt rounds for better security
    const user = new User({
      username: trimmedUsername,
      email: normalizedEmail,
      password: hashedPassword,
    });

    await user.save();
    console.log(
      `✅ User registered successfully - ID: ${user._id}, Username: ${trimmedUsername}`
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Extended token life
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: trimmedUsername,
        email: normalizedEmail,
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({
      message: "Error registering user",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
});

// Enhanced login route with case-insensitive email/username lookup
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  console.log(`🔐 Login attempt - Identifier: ${identifier}`);

  if (!identifier || !password) {
    console.log("❌ Login failed - Missing credentials");
    return res.status(400).json({
      message: "Email or username and password are required",
    });
  }

  try {
    // Normalize identifier to lowercase for case-insensitive lookup
    const normalizedIdentifier = identifier.toLowerCase().trim();

    // Search for user by email (case-insensitive) or username (case-insensitive)
    const user = await User.findOne({
      $or: [
        { email: normalizedIdentifier },
        { username: { $regex: new RegExp(`^${normalizedIdentifier}$`, "i") } },
      ],
    });

    if (!user) {
      console.log(`❌ Login failed - User not found: ${normalizedIdentifier}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(
        `❌ Login failed - Wrong password for user: ${user.username}`
      );
      return res.status(400).json({ message: "Invalid credentials" });
    }

    console.log(
      `✅ Login successful - User: ${user.username} (ID: ${user._id})`
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h", // Extended token life
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        profilePicture: user.profilePicture || "",
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({
      message: "Error logging in",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
});

// Enhanced /me route with better error handling
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log(`❌ User not found for token - ID: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ User profile fetched - Username: ${user.username}`);

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("❌ Error fetching user profile:", err.message);
    res.status(500).json({
      message: "Error fetching user",
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error",
    });
  }
});

// New route to check if username/email exists (for real-time validation)
router.post("/check-availability", async (req, res) => {
  const { username, email } = req.body;

  try {
    const checks = {};

    if (username) {
      const existingUsername = await User.findOne({
        username: { $regex: new RegExp(`^${username.trim()}$`, "i") },
      });
      checks.username = !existingUsername;
    }

    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      const existingEmail = await User.findOne({ email: normalizedEmail });
      checks.email = !existingEmail;
    }

    res.json(checks);
  } catch (err) {
    console.error("❌ Error checking availability:", err.message);
    res.status(500).json({ message: "Error checking availability" });
  }
});

module.exports = router;
