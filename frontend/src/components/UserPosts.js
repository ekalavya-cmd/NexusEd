import React, { useState } from "react";
import { Button, ButtonGroup, Spinner } from "react-bootstrap";
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
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

        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
          <h6 className="mb-2 mb-md-0 me-0 me-md-2 text-muted">
            Sort by:
          </h6>
          <ButtonGroup className="sort-filter">
            <Button
              variant={sortOption === "newest" ? "primary" : "outline-primary"}
              onClick={() => sortPosts("newest")}
              className="sort-btn"
            >
              Newest
            </Button>
            <Button
              variant={sortOption === "oldest" ? "primary" : "outline-primary"}
              onClick={() => sortPosts("oldest")}
              className="sort-btn"
            >
              Oldest
            </Button>
            <Button
              variant={sortOption === "popular" ? "primary" : "outline-primary"}
              onClick={() => sortPosts("popular")}
              className="sort-btn"
            >
              Most Liked
            </Button>
          </ButtonGroup>
        </div>
      </div>

      {showPostForm && (
        <div className="mb-4">
          <PostForm handleCreatePost={handleCreatePost} />
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-comment-alt display-1 text-muted"></i>
          </div>
          <h4 className="mb-3">No Posts Yet</h4>
          <p className="text-muted mb-4">
            You haven&apos;t created any posts yet. Share your thoughts with the community!
          </p>
          <Button 
            variant="primary" 
            onClick={() => setShowPostForm(true)}
            className="btn-hover-shadow"
          >
            <i className="fas fa-plus me-2"></i>
            Create Your First Post
          </Button>
        </div>
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
