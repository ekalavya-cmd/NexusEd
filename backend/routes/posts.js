const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");
const { deleteFiles } = require("../utils/fileUtils");

router.get("/", async (req, res) => {
  try {
    const { author } = req.query;
    const query = author ? { author } : {};
    const posts = await Post.find(query)
      .populate("author", "username")
      .populate("comments.author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err.message);
    res.status(500).json({ message: err.message || "Error fetching posts" });
  }
});

router.post("/", auth, (req, res, next) => {
  const upload = req.app.get("upload");
  upload.array("files", 5)(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    // Debug logging
    console.log("Request body:", req.body);
    console.log("Files:", req.files);
    
    // Extract data from req.body, handling both regular and FormData requests
    const title = req.body.title || null;
    const content = req.body.content || "";
    const studyGroup = req.body.studyGroup || null;
    
    // For regular posts, title is required. For group posts, title is optional
    if (!studyGroup && !title) {
      return res
        .status(400)
        .json({ message: "Title is required for general posts" });
    }
    
    if (!content.trim()) {
      return res
        .status(400)
        .json({ message: "Content is required" });
    }
    
    const postData = {
      content,
      author: req.user.id,
    };
    
    if (title) {
      postData.title = title;
    }
    
    if (studyGroup) {
      postData.studyGroup = studyGroup;
    }
    
    // Handle file uploads
    if (req.files && req.files.length > 0) {
      postData.files = req.files.map(file => ({
        name: file.originalname,
        url: `/uploads/${file.filename}`,
        mimetype: file.mimetype,
        size: file.size,
      }));
    }
    
    const post = new Post(postData);
    await post.save();
    
    let populatedPost = await Post.findById(post._id).populate("author", "username");
    
    if (studyGroup) {
      populatedPost = await Post.findById(post._id)
        .populate("author", "username")
        .populate("studyGroup", "name");
    }
    
    res.status(201).json(populatedPost);
  } catch (err) {
    console.error("Error creating post:", err.message);
    res.status(500).json({ message: err.message || "Error creating post" });
  }
});

// Get posts by group ID
router.get("/group/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    const posts = await Post.find({ studyGroup: groupId })
      .populate("author", "username")
      .populate("comments.author", "username")
      .populate("studyGroup", "name")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error("Error fetching group posts:", err.message);
    res.status(500).json({ message: err.message || "Error fetching group posts" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    
    // Delete associated files from uploads folder
    if (post.files && post.files.length > 0) {
      deleteFiles(post.files);
    }
    
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    console.error("Error deleting post:", err.message);
    res.status(500).json({ message: err.message || "Error deleting post" });
  }
});

router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({
      content,
      author: req.user.id,
    });
    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.author", "username");
    res.json(updatedPost);
  } catch (err) {
    console.error("Error adding comment:", err.message);
    res.status(500).json({ message: err.message || "Error adding comment" });
  }
});

router.delete("/:id/comments/:commentId", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    post.comments.pull({ _id: req.params.commentId });
    await post.save();
    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "username")
      .populate("comments.author", "username");
    res.json(updatedPost);
  } catch (err) {
    console.error("Error deleting comment:", err.message);
    res.status(500).json({ message: err.message || "Error deleting comment" });
  }
});

router.post("/:id/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Verify author exists
    const authorExists = await User.findById(post.author);
    if (!authorExists) {
      post.author = null; // Or set to a default ObjectId if required
    }

    const isLiked = post.likes.includes(req.user.id);
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { [isLiked ? "$pull" : "$addToSet"]: { likes: req.user.id } },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(500).json({ message: "Failed to update post" });
    }

    // Populate with error handling
    let populatedPost;
    try {
      populatedPost = await Post.findById(postId)
        .populate("author", "username")
        .populate("comments.author", "username");
    } catch (populateErr) {
      console.error("Populate error in like post");
      populatedPost = updatedPost; // Fallback to unpopulated post
      populatedPost.author = { username: "Unknown", _id: post.author || null };
    }

    res.json(populatedPost);
  } catch (err) {
    console.error("Error liking post:", err.message);
    res.status(500).json({ message: err.message || "Error liking post" });
  }
});

router.post("/:id/comments/:commentId/like", auth, async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Verify comment author exists
    const commentAuthorExists = await User.findById(comment.author);
    if (!commentAuthorExists) {
      comment.author = null; // Or set to a default ObjectId if required
    }

    const isLiked = comment.likes.includes(req.user.id);
    if (isLiked) {
      comment.likes.pull(req.user.id);
    } else {
      if (!comment.likes.includes(req.user.id)) {
        comment.likes.push(req.user.id);
      }
    }

    await post.save();

    // Populate with error handling
    let populatedPost;
    try {
      populatedPost = await Post.findById(postId)
        .populate("author", "username")
        .populate("comments.author", "username");
    } catch (populateErr) {
      console.error("Populate error in like comment");
      populatedPost = post; // Fallback to unpopulated post
      populatedPost.author = { username: "Unknown", _id: post.author || null };
      populatedPost.comments = populatedPost.comments.map((c) => ({
        ...c,
        author: c.author
          ? { username: "Unknown", _id: c.author }
          : { username: "Unknown", _id: null },
      }));
    }

    res.json(populatedPost);
  } catch (err) {
    console.error("Error liking comment:", err.message);
    res.status(500).json({ message: err.message || "Error liking comment" });
  }
});

module.exports = router;
