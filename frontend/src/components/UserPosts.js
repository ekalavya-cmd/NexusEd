import React from "react";
import PostCard from "./PostCard";

const UserPosts = ({
  posts,
  isPostsLoading,
  sortOption,
  setSortOption,
  setPosts,
  currentUser,
}) => {
  const sortPosts = (posts) => {
    const sortedPosts = [...posts];
    switch (sortOption) {
      case "newest":
        return sortedPosts.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      case "oldest":
        return sortedPosts.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
      case "mostLikes":
        return sortedPosts.sort(
          (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
        );
      case "leastLikes":
        return sortedPosts.sort(
          (a, b) => (a.likes?.length || 0) - (b.likes?.length || 0)
        );
      default:
        return sortedPosts;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6 animate-fade-in-up mt-10">
        <h3 className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline">
          My Posts
        </h3>
        <div>
          <label
            htmlFor="sort-posts"
            className="text-gray-600 dark:text-gray-200 mr-2"
          >
            Sort by:
          </label>
          <select
            id="sort-posts"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border-2 border-gradient-to-r from-blue-300 to-indigo-300 dark:from-gray-500 dark:to-gray-400 rounded-lg p-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-500 hover:shadow-[0_0_5px_rgba(59,130,246,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)] dark:hover:dark-glow transition-all duration-300"
            aria-label="Sort posts"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="mostLikes">Most Likes</option>
            <option value="leastLikes">Least Likes</option>
          </select>
        </div>
      </div>
      <div className="space-y-6 animate-fade-in-up">
        {isPostsLoading ? (
          <div className="text-gray-600 dark:text-gray-400 py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-gray-400"></div>
            <p className="mt-2">Loading posts...</p>
          </div>
        ) : sortPosts(posts).length > 0 ? (
          sortPosts(posts).map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              title={post.title}
              content={post.content}
              author={post.author?.username || "Unknown"}
              comments={post.comments}
              likes={post.likes}
              post={post}
              setPosts={setPosts}
              currentUser={currentUser}
            />
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No posts yet.</p>
        )}
      </div>
    </>
  );
};

export default UserPosts;
