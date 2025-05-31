import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

function PostForm({ setPosts }) {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef(null);

  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const postButtonRef = useRef(null);

  const setTemporaryMessage = (type, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (type === "error") {
      setError(message);
      setSuccess("");
    } else if (type === "success") {
      setSuccess(message);
      setError("");
    }
    timeoutRef.current = setTimeout(() => {
      setError("");
      setSuccess("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (postButtonRef.current) {
      postButtonRef.current.blur();
    }

    if (!user) {
      setTemporaryMessage("error", "Please log in to create a post");
      setIsLoading(false);
      return;
    }
    if (!title.trim() || !content.trim()) {
      setTemporaryMessage("error", "Title and content are required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create post");
      }

      const newPost = await response.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setTitle("");
      setContent("");
      setTemporaryMessage("success", "Post created successfully!");
    } catch (err) {
      setTemporaryMessage(
        "error",
        err.message || "An error occurred while creating the post"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (contentRef.current) {
        contentRef.current.focus();
      }
    }
  };

  const handleContentKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setContent(content + "\n");
      } else {
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 mb-8 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300">
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
      <h2 className="relative text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-6 hover-underline">
        Create a Post
      </h2>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md animate-fade-in-up hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 dark:bg-green-900/70 text-green-700 dark:text-green-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 shadow-md animate-fade-in-up hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300">
          {success}
        </div>
      )}
      <div className="mb-5">
        <label
          htmlFor="title"
          className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Post title"
          className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
          ref={titleRef}
          disabled={isLoading}
          aria-label="Post Title"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="content"
          className="block text-gray-700 dark:text-gray-200 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
        >
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleContentKeyDown}
          placeholder="What's on your mind?"
          className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
          rows="4"
          ref={contentRef}
          disabled={isLoading}
          aria-label="Post Content"
        />
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 flex items-center space-x-2"
        ref={postButtonRef}
        disabled={isLoading || !user}
        aria-label="Create Post"
      >
        <i className="fa-solid fa-paper-plane text-base"></i>
        <span>{isLoading ? "Posting..." : "Post"}</span>
      </button>
    </div>
  );
}

export default PostForm;
