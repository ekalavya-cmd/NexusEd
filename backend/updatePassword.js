// updatePassword.js

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Replace with your actual MongoDB URI
const uri = "mongodb://localhost:27017/nexused";

// Connect to MongoDB
mongoose
  .connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define schema based on your collection structure
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bio: String,
  profilePicture: String,
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);

// Function to update password
async function updatePassword(email, newPlainPassword) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPlainPassword, saltRounds);

    const result = await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (result) {
      console.log("✅ Password updated successfully for:", result.username);
    } else {
      console.log("❌ User not found with email:", email);
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error updating password:", error);
    mongoose.connection.close();
  }
}

// Call the function — replace with your values
updatePassword("ajs@gmail.com", "Test@123");
