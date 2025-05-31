const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    unique: true,
    minlength: [3, "Username must be at least 3 characters long"],
    maxlength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  bio: {
    type: String,
    trim: true,
    maxlength: [200, "Bio cannot exceed 200 characters"],
    default: "",
  },
  profilePicture: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
