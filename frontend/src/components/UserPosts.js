import React, { useState } from "react";
import { Button, ButtonGroup, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import PostCard from "./PostCard";
import PostForm from "./PostForm";

function UserPosts({
  posts,
  setPosts,
  isLoading,
  userId,
  sortOption,
  setSortOption,
  setTemporaryMessage,
  setTemporarySuccess,
}) {
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showPostForm, setShowPostForm] = useState(false);

  const sortPosts = (option) => {
    setSortOption(option);
    let sortedPosts = [...posts];

    switch (option) {
      case "newest":
        sortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sortedPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      case "popular":
        sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
        break;
      default:
        break;
    }

    setPosts(sortedPosts);
  };

  const handleCreatePost = async (content) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts([response.data, ...posts]);
      setShowPostForm(false);
      setTemporarySuccess("Post created successfully!");
      return true;
    } catch (err) {
      console.error("Error creating post:", err);
      setTemporaryMessage("Failed to create post. Please try again.");
      return false;
    }
  };

  const handleLikePost = async (postId) => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
    } catch (err) {
      console.error("Error liking post:", err);
      setTemporaryMessage("Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(posts.filter((post) => post._id !== postId));
      setTemporarySuccess("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      setTemporaryMessage("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (postId, content) => {
    if (isCommenting) return;

    try {
      setIsCommenting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
      setTemporarySuccess("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      setTemporaryMessage("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
      setTemporarySuccess("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      setTemporaryMessage("Failed to delete comment. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading posts...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button
            variant={showPostForm ? "outline-secondary" : "primary"}
            onClick={() => setShowPostForm(!showPostForm)}
            className="btn-hover-shadow"
          >
            <i className={`fas fa-${showPostForm ? "times" : "plus"} me-2`}></i>
            {showPostForm ? "Cancel" : "Create Post"}
          </Button>
        </div>

        <ButtonGroup>
          <Button
            variant={sortOption === "newest" ? "primary" : "outline-primary"}
            onClick={() => sortPosts("newest")}
          >
            Newest
          </Button>
          <Button
            variant={sortOption === "oldest" ? "primary" : "outline-primary"}
            onClick={() => sortPosts("oldest")}
          >
            Oldest
          </Button>
          <Button
            variant={sortOption === "popular" ? "primary" : "outline-primary"}
            onClick={() => sortPosts("popular")}
          >
            Most Liked
          </Button>
        </ButtonGroup>
      </div>

      {showPostForm && (
        <div className="mb-4">
          <PostForm handleCreatePost={handleCreatePost} />
        </div>
      )}

      {posts.length === 0 ? (
        <Alert variant="info">
          <div className="d-flex align-items-center">
            <i className="fas fa-info-circle me-3 fs-5"></i>
            <div>
              <p className="mb-0">You haven't created any posts yet.</p>
            </div>
          </div>
        </Alert>
      ) : (
        posts.map((post, index) => (
          <PostCard
            key={post._id}
            post={post}
            currentUser={{ id: userId }}
            handleLikePost={handleLikePost}
            handleDeletePost={handleDeletePost}
            handleAddComment={handleAddComment}
            handleDeleteComment={handleDeleteComment}
            isLiking={isLiking}
            isDeleting={isDeleting}
            isCommenting={isCommenting}
            animationDelay={`${index * 0.1}s`}
          />
        ))
      )}
    </div>
  );
}

export default UserPosts;
