const StudyGroup = require("../models/StudyGroup");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Get all study groups
exports.getStudyGroups = async (req, res) => {
  try {
    const groups = await StudyGroup.find()
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");
    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching study groups:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single study group by ID
exports.getStudyGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    const group = await StudyGroup.findById(groupId)
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");

    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error fetching study group:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Create a new study group
exports.createStudyGroup = async (req, res) => {
  try {
    const { name, description, category, groupImage } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ message: "Name, description, and category are required" });
    }

    const group = new StudyGroup({
      name,
      description,
      category,
      creator: userId,
      members: [userId],
      groupImage: groupImage || "fa-users",
    });
    await group.save();

    const populatedGroup = await StudyGroup.findById(group._id)
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error creating study group:", error.message);
    res
      .status(400)
      .json({ message: "Failed to create study group", error: error.message });
  }
};

// Update a study group
exports.updateStudyGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (group.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can update this group" });
    }

    const { name, description, category, groupImage } = req.body;

    if (!name || !description || !category) {
      return res
        .status(400)
        .json({ message: "Name, description, and category are required" });
    }

    const updatedGroup = await StudyGroup.findByIdAndUpdate(
      groupId,
      { $set: { name, description, category, groupImage } },
      { new: true }
    )
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");

    if (!updatedGroup) {
      return res.status(404).json({ message: "Study group not found" });
    }

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error updating study group:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a study group
exports.deleteStudyGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (group.creator.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this group" });
    }

    // Delete all associated files in messages
    for (const message of group.messages) {
      if (message.files && message.files.length > 0) {
        for (const file of message.files) {
          const filePath = path.join(__dirname, "..", file.url);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    }

    await StudyGroup.findByIdAndDelete(groupId);
    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    console.error("Error deleting study group:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Join a study group
exports.joinStudyGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (group.members.some(member => member.toString() === userId)) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.members.push(userId);
    await group.save();

    const populatedGroup = await StudyGroup.findById(groupId)
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");

    res.status(200).json(populatedGroup);
  } catch (error) {
    console.error("Error joining study group:", error.message);
    res
      .status(400)
      .json({ message: "Failed to join study group", error: error.message });
  }
};

// Leave a study group
exports.leaveStudyGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (!group.members.some(member => member.toString() === userId)) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    if (group.creator.toString() === userId) {
      return res.status(400).json({
        message: "Creator cannot leave the group. Delete the group instead.",
      });
    }

    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );
    await group.save();

    const populatedGroup = await StudyGroup.findById(groupId)
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");

    res.status(200).json(populatedGroup);
  } catch (error) {
    console.error("Error leaving study group:", error.message);
    res
      .status(400)
      .json({ message: "Failed to leave study group", error: error.message });
  }
};

// Get messages for a study group
exports.getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await StudyGroup.findById(groupId)
      .populate("messages.author", "username")
      .select("messages members");

    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (!group.members.some(member => member.toString() === userId)) {
      return res.status(403).json({ 
        message: "You must be a member to view messages" 
      });
    }

    // Sort messages by creation date (newest first)
    const sortedMessages = group.messages.sort((a, b) => 
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    res.status(200).json(sortedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Add a message to the group's discussion board
exports.addMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user?.id;
    const { content } = req.body;
    const files = req.files;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!content && (!files || files.length === 0)) {
      return res.status(400).json({ message: "Message or files are required" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    if (!group.members.some(member => member.toString() === userId)) {
      return res
        .status(403)
        .json({ message: "You must be a member to post a message" });
    }

    const messageData = {
      author: userId,
    };

    if (content) {
      const trimmedContent = content.trim();
      if (trimmedContent.length > 500) {
        return res
          .status(400)
          .json({ message: "Message cannot exceed 500 characters" });
      }
      messageData.content = trimmedContent;
    }

    if (files && files.length > 0) {
      messageData.files = files.map((file) => ({
        url: `/uploads/${file.filename}`,
        name: file.originalname,
      }));
    }

    group.messages.push(messageData);
    await group.save();

    // Get the newly created message with populated author
    const updatedGroup = await StudyGroup.findById(groupId)
      .populate("messages.author", "username");
    
    const newMessage = updatedGroup.messages[updatedGroup.messages.length - 1];

    res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error adding message:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a message from the group's discussion board
exports.deleteMessage = async (req, res) => {
  try {
    const { groupId, messageId } = req.params;
    const userId = req.user?.id;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Study group not found" });
    }

    const message = group.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (message.author.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "You can only delete your own messages" });
    }

    // Delete associated files
    if (message.files && message.files.length > 0) {
      for (const file of message.files) {
        const filePath = path.join(__dirname, "..", file.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    group.messages.pull({ _id: messageId });
    await group.save();

    const updatedGroup = await StudyGroup.findById(groupId)
      .populate("creator", "username")
      .populate("members", "username")
      .populate("messages.author", "username");

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error deleting message:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
