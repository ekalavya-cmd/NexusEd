const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StudyGroup",
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Event", eventSchema);
