import React, { useState, useEffect, useRef } from "react";

function PostCard({
  title,
  content,
  author,
  id,
  setPosts,
  currentUser,
  comments,
  likes,
  post,
}) {
  const [commentContent, setCommentContent] = useState("");
  const [error, setError] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);
  const timeoutRef = useRef(null);

  const commentButtonRef = useRef(null);
  const likePostButtonRef = useRef(null);
  const likeCommentButtonRefs = useRef({});

  const setTemporaryError = (message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(message);
    timeoutRef.current = setTimeout(() => {
      setError("");
      timeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleDeletePost = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Failed to delete post (HTTP ${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));
      setError("");
    } catch (err) {
      setTemporaryError(err.message || "Failed to delete post");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Failed to delete comment (HTTP ${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? {
                ...updatedPost,
                author: updatedPost.author?.username
                  ? updatedPost.author
                  : { username: author, _id: post.author?._id },
              }
            : post
        )
      );
      setError("");
    } catch (err) {
      setTemporaryError(err.message || "Failed to delete comment");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsCommenting(true);

    if (commentButtonRef.current) {
      commentButtonRef.current.blur();
    }

    if (!commentContent.trim()) {
      setTemporaryError("Comment cannot be empty");
      setIsCommenting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: commentContent }),
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Failed to add comment (HTTP ${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? {
                ...updatedPost,
                author: updatedPost.author?.username
                  ? updatedPost.author
                  : { username: author, _id: post.author?._id },
              }
            : post
        )
      );
      setCommentContent("");
      setError("");
    } catch (err) {
      setTemporaryError(err.message || "Failed to add comment");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleLikePost = async () => {
    try {
      if (likePostButtonRef.current) {
        likePostButtonRef.current.blur();
      }

      const token = localStorage.getItem("token");
      if (!token || !currentUser) {
        throw new Error("User must be logged in to like a post");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Failed to like post (HTTP ${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const updatedPost = await response.json();
      if (!updatedPost._id) {
        throw new Error("Invalid response: Missing _id");
      }

      setPosts((prevPosts) => {
        const newPosts = prevPosts.map((post) => {
          if (post._id === id) {
            const newAuthor =
              typeof updatedPost.author === "object" &&
              updatedPost.author?.username
                ? updatedPost.author
                : {
                    username: author,
                    _id:
                      typeof updatedPost.author === "string"
                        ? updatedPost.author
                        : post.author?._id,
                  };
            const updated = {
              ...updatedPost,
              author: newAuthor,
              comments: Array.isArray(updatedPost.comments)
                ? updatedPost.comments
                : post.comments || [],
              likes: Array.isArray(updatedPost.likes)
                ? updatedPost.likes
                : post.likes || [],
            };
            return updated;
          }
          return post;
        });
        return newPosts;
      });
      setError("");
    } catch (err) {
      setTemporaryError(err.message || "Failed to like post");
    }
  };

  const handleLikeComment = async (commentId) => {
    try {
      if (likeCommentButtonRefs.current[commentId]) {
        likeCommentButtonRefs.current[commentId].blur();
      }

      const token = localStorage.getItem("token");
      if (!token || !currentUser) {
        throw new Error("User must be logged in to like a comment");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts/${id}/comments/${commentId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Failed to like comment (HTTP ${response.status})`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          const errorText = await response.text();
          errorMessage =
            errorText ||
            `Server responded with non-JSON content (HTTP ${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const updatedPost = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === id
            ? {
                ...updatedPost,
                author:
                  typeof updatedPost.author === "object" &&
                  updatedPost.author?.username
                    ? updatedPost.author
                    : {
                        username: author,
                        _id:
                          typeof updatedPost.author === "string"
                            ? updatedPost.author
                            : post.author?._id,
                      },
              }
            : post
        )
      );
      setError("");
    } catch (err) {
      setTemporaryError(err.message || "Failed to like comment");
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setCommentContent(commentContent + "\n");
      } else {
        e.preventDefault();
        handleCommentSubmit(e);
      }
    }
  };

  const formatDateTime = (date) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    return formatter.format(new Date(date)).replace(" at", ",");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300">
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
            50% { box-shadow: 0 0 15px rgba(209, 213, 219, 0.5); }
            100% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .dark-glow {
            animation: glow 2s infinite ease-in-out;
          }
          .hover-underline::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right, #2563eb, #4f46e5);
            transition: width 0.3s ease-in-out;
          }
          .dark .hover-underline::after {
            background: linear-gradient(to right, #9ca3af, #d1d5db);
          }
          .hover-underline:hover::after {
            width: 100%;
          }
        `}
      </style>
      <h2 className="relative text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-2 hover-underline">
        {title}
      </h2>
      <p className="text-gray-600 dark:text-gray-200 mb-3 transition-all duration-200">
        {content}
      </p>
      <p className="text-sm mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
        Posted by {author} on {formatDateTime(post.createdAt)}
      </p>
      <div className="flex items-center space-x-3 mb-6">
        {currentUser && (
          <button
            onClick={handleLikePost}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-600 dark:to-indigo-600 text-white dark:text-gray-200 px-2.5 py-1 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(88,28,135,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 text-sm flex items-center space-x-1 w-12 justify-center"
            ref={likePostButtonRef}
            disabled={!currentUser}
            aria-label={
              likes && currentUser && likes.includes(currentUser.id.toString())
                ? "Unlike Post"
                : "Like Post"
            }
          >
            <i
              className={`${
                likes &&
                currentUser &&
                likes.includes(currentUser.id.toString())
                  ? "fa-solid fa-heart"
                  : "fa-regular fa-heart"
              } text-base`}
            ></i>
            <span>{likes?.length || 0}</span>
          </button>
        )}
        {currentUser && post.author?._id?.toString() === currentUser.id && (
          <button
            onClick={handleDeletePost}
            className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 px-1.5 py-1.5 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1 w-12 justify-center"
            aria-label="Delete Post"
          >
            <i className="fa-solid fa-trash text-base"></i>
          </button>
        )}
      </div>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md animate-fade-in-up hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300">
          {error}
        </div>
      )}
      <div>
        <h4 className="relative text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-4 hover-underline">
          Comments
        </h4>
        {comments && comments.length > 0 ? (
          comments.map((comment, index) => (
            <div
              key={comment._id}
              className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-4 mb-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-gray-600 dark:text-gray-200 mb-2 transition-all duration-200">
                {comment.content}
              </p>
              <p className="text-sm mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
                By {comment.author?.username || "Unknown"} on{" "}
                {formatDateTime(comment.createdAt)}
              </p>
              <div className="flex items-center space-x-3">
                {currentUser && (
                  <button
                    onClick={() => handleLikeComment(comment._id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-600 dark:to-indigo-600 text-white dark:text-gray-200 px-2.5 py-1 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(88,28,135,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 text-sm flex items-center space-x-1 w-12 justify-center"
                    ref={(el) =>
                      (likeCommentButtonRefs.current[comment._id] = el)
                    }
                    disabled={!currentUser}
                    aria-label={
                      comment.likes &&
                      currentUser &&
                      comment.likes.includes(currentUser.id.toString())
                        ? "Unlike Comment"
                        : "Like Comment"
                    }
                  >
                    <i
                      className={`${
                        comment.likes &&
                        currentUser &&
                        comment.likes.includes(currentUser.id.toString())
                          ? "fa-solid fa-heart"
                          : "fa-regular fa-heart"
                      } text-base`}
                    ></i>
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                )}
                {currentUser &&
                  comment.author?._id?.toString() === currentUser.id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 px-1.5 py-1.5 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1 w-12 justify-center"
                      aria-label="Delete Comment"
                    >
                      <i className="fa-solid fa-trash text-base"></i>
                    </button>
                  )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-200">
            No comments yet.
          </p>
        )}
        {currentUser && (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              onKeyDown={handleCommentKeyDown}
              placeholder="Add a comment"
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-200 mb-4 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              rows="2"
              disabled={isCommenting}
              aria-label="Comment"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 text-sm flex items-center space-x-2"
              ref={commentButtonRef}
              disabled={isCommenting}
              aria-label="Submit Comment"
            >
              <i className="fa-solid fa-comment text-base"></i>
              <span>{isCommenting ? "Commenting..." : "Comment"}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default PostCard;
