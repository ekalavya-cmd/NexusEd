const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getStudyGroups,
  getStudyGroupById,
  createStudyGroup,
  updateStudyGroup,
  deleteStudyGroup,
  joinStudyGroup,
  leaveStudyGroup,
  addMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/studyGroupController");

// Public routes
router.get("/", getStudyGroups);
router.get("/:groupId", getStudyGroupById);

// Protected routes: Require authentication
router.post("/", auth, createStudyGroup);
router.put("/:groupId", auth, updateStudyGroup);
router.delete("/:groupId", auth, deleteStudyGroup);
router.post("/:groupId/join", auth, joinStudyGroup);
router.post("/:groupId/leave", auth, leaveStudyGroup);
router.post(
  "/:groupId/messages",
  auth,
  (req, res, next) => {
    const upload = req.app.get("upload");
    upload.array("files", 5)(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: err.message });
      }
      next();
    });
  },
  addMessage
);
router.get("/:groupId/messages", auth, getMessages);
router.delete("/:groupId/messages/:messageId", auth, deleteMessage);

module.exports = router;
