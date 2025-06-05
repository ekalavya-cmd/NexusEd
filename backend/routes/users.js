const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const multer = require("multer");
const fs = require("fs"); // Add fs to check directory and delete files

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    // Ensure uploads directory exists
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      console.error("File type not allowed:", file.mimetype);
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("profilePicture");

// Route to get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.error("User not found for ID:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture || "",
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Error fetching user profile:", err.message);
    res
      .status(500)
      .json({ message: "Error fetching user profile", error: err.message });
  }
});

// Route to upload profile picture
router.post("/upload-profile-picture", auth, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: err.message });
    }

    try {
      if (!req.file) {
        console.error("No file uploaded in request");
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        console.error("User not found for ID:", req.user.id);
        return res.status(404).json({ message: "User not found" });
      }

      // Save the file path as the profile picture URL
      user.profilePicture = `/uploads/${req.file.filename}`;
      await user.save();

      res.json({ profilePicture: user.profilePicture });
    } catch (err) {
      console.error("Error uploading profile picture:", err.message);
      res
        .status(500)
        .json({ message: err.message || "Failed to upload profile picture" });
    }
  });
});

// Route to update user profile (bio and username)
router.put("/profile", auth, async (req, res) => {
  const { bio, username } = req.body;

  // Validate bio
  if (bio && (typeof bio !== "string" || bio.trim().length === 0)) {
    console.error("Invalid bio:", bio);
    return res.status(400).json({ message: "Bio must be a non-empty string" });
  }

  // Validate username
  if (username) {
    if (typeof username !== "string" || username.trim().length === 0) {
      console.error("Invalid username:", username);
      return res
        .status(400)
        .json({ message: "Username must be a non-empty string" });
    }
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      console.error("Username length invalid:", trimmedUsername);
      return res
        .status(400)
        .json({ message: "Username must be between 3 and 20 characters" });
    }
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      console.error("Username contains invalid characters:", trimmedUsername);
      return res.status(400).json({
        message: "Username can only contain letters, numbers, and underscores",
      });
    }
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("User not found for ID:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username is already taken (if updating username)
    if (username && username.trim() !== user.username) {
      const existingUser = await User.findOne({ username: username.trim() });
      if (existingUser) {
        console.error("Username already taken:", username);
        return res.status(400).json({ message: "Username already taken" });
      }
      user.username = username.trim();
    }

    if (bio) {
      user.bio = bio.trim();
    }

    await user.save();
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture || "",
      createdAt: user.createdAt, // Include createdAt in the response
    });
  } catch (err) {
    console.error("Error updating profile:", err.message);
    res
      .status(500)
      .json({ message: "Error updating profile", error: err.message });
  }
});

// Route to remove profile picture
router.delete("/me/profile-picture", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("User not found for ID:", req.user.id);
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user has a profile picture
    if (!user.profilePicture) {
      console.log("No profile picture to remove for user:", req.user.id);
      return res.status(400).json({ message: "No profile picture to remove" });
    }

    // Delete the file from the uploads directory
    const filePath = `uploads/${user.profilePicture.split("/uploads/")[1]}`;
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log("Profile picture file deleted:", filePath);
      } else {
        console.warn("Profile picture file not found on disk:", filePath);
      }
    } catch (fileErr) {
      console.error("Error deleting profile picture file:", fileErr.message);
      // Continue with removing the reference even if the file deletion fails
    }

    // Remove the profile picture reference from the user
    user.profilePicture = null;
    await user.save();

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture || "",
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Error removing profile picture:", err.message);
    res.status(500).json({
      message: "Error removing profile picture",
      error: err.message,
    });
  }
});

module.exports = router;
