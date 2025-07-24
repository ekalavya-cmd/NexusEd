const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const StudyGroup = require("../models/StudyGroup");
const auth = require("../middleware/auth");

// Create a new event
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, start, end, groupId } = req.body;

    // Validate group exists and user is a member
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isMember = group.members.some(
      (member) => member._id.toString() === req.user.id
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You must be a member of the group to create an event",
      });
    }

    const event = new Event({
      title,
      description,
      start,
      end,
      group: groupId,
      creator: req.user.id,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all events for the user's groups
router.get("/", auth, async (req, res) => {
  try {
    // Find all groups the user is a member of
    const groups = await StudyGroup.find({
      members: req.user.id,
    });

    const groupIds = groups.map((group) => group._id);

    // Clean up expired events first
    const currentTime = new Date();
    await Event.deleteMany({ 
      group: { $in: groupIds }, 
      end: { $lt: currentTime } 
    });

    // Fetch active events for those groups (events that haven't ended)
    const events = await Event.find({ 
      group: { $in: groupIds },
      end: { $gte: currentTime }
    })
      .populate("group", "name _id") // Explicitly include _id
      .populate("creator", "username _id") // Explicitly include _id
      .sort({ start: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get all events for a specific group
router.get("/group/:groupId", auth, async (req, res) => {
  try {
    const { groupId } = req.params;

    // Validate group exists and user is a member
    const group = await StudyGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isMember = group.members.some(
      (member) => member._id.toString() === req.user.id
    );
    if (!isMember) {
      return res.status(403).json({
        message: "You must be a member of the group to view its events",
      });
    }

    // Clean up expired events first
    const currentTime = new Date();
    await Event.deleteMany({ 
      group: groupId, 
      end: { $lt: currentTime } 
    });

    // Fetch active events for the group (events that haven't ended)
    const events = await Event.find({ 
      group: groupId,
      end: { $gte: currentTime }
    })
      .populate("group", "name _id")
      .populate("creator", "username _id")
      .sort({ start: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete an event
router.delete("/:id", auth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Only the creator can delete the event
    if (event.creator.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the creator can delete this event" });
    }

    await Event.deleteOne({ _id: req.params.id });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
