const mongoose = require("mongoose");

const studyGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Study group name is required"],
    trim: true,
    minlength: [1],
    maxlength: [50, "Study group name cannot exceed 50 characters"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [1],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: [
        "Mathematics",
        "Programming",
        "Literature",
        "Science",
        "History",
      ],
      message:
        "Invalid category. Choose from: Mathematics, Programming, Literature, Science, History",
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  groupImage: {
    type: String,
    default: "fa-users",
    enum: {
      values: [
        "fa-users",
        "fa-book",
        "fa-code",
        "fa-flask",
        "fa-history",
        "fa-calculator",
      ],
      message:
        "Invalid icon. Choose from: fa-users, fa-book, fa-code, fa-flask, fa-history, fa-calculator",
    },
  },
  messages: [
    {
      content: {
        type: String,
        trim: true,
        minlength: [1, "Message content cannot be empty"],
        maxlength: [500, "Message cannot exceed 500 characters"],
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      files: [
        {
          url: {
            type: String,
            required: true,
          },
          name: {
            type: String,
            required: true,
          },
        },
      ],
    },
  ],
});

// Remove the required constraint on content since users can post files without text
studyGroupSchema.path("messages").schema.path("content").required(false);

module.exports = mongoose.model("StudyGroup", studyGroupSchema);
