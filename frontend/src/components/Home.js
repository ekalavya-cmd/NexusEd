import React, { useState, useEffect, useContext, useRef } from "react";
import PostForm from "./PostForm";
import PostCard from "./PostCard";
import { AuthContext } from "../context/AuthContext";

function Home() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [fadeIn, setFadeIn] = useState(false);
  const timeoutRef = useRef(null);
  const prevUserRef = useRef(user);

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
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/posts`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setTemporaryError("Failed to load posts. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (prevUserRef.current && !user) {
      setFadeIn(true);
    }
    prevUserRef.current = user;
  }, [user]);

  return (
    <section
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-10"
      aria-label="Home Feed"
    >
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
            50% { box-shadow: 0 0 15px rgba(209, 213, 219, 0.5); }
            100% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-in forwards;
          }
          .animate-pulse-text {
            animation: pulse 1.5s infinite;
          }
          .dark-glow {
            animation: glow 2s infinite ease-in-out;
          }
        `}
      </style>
      <div
        key={user ? "logged-in" : "logged-out"}
        className={`container px-4 ${
          fadeIn ? "animate-fade-in" : "animate-fade-in-up"
        }`}
      >
        {user && (
          <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] transition-all duration-300">
            <PostForm setPosts={setPosts} />
          </div>
        )}
        {error && (
          <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mb-8 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] transition-all duration-300 animate-fade-in-up">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg flex flex-col items-center justify-center border border-gray-200 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] transition-all duration-300 animate-fade-in-up">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg animate-pulse-text">
              Loading posts...
            </p>
          </div>
        ) : posts.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-8 border border-gray-200 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] transition-all duration-300 animate-fade-in-up">
            {posts.map((post, index) => (
              <div
                key={post._id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <PostCard
                  id={post._id}
                  title={post.title}
                  content={post.content}
                  author={post.author?.username || "Unknown"}
                  comments={post.comments}
                  likes={post.likes}
                  post={post}
                  setPosts={setPosts}
                  currentUser={user}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-300 hover:scale-105 animate-fade-in-up">
            No posts available.
          </p>
        )}
      </div>
    </section>
  );
}

export default Home;
