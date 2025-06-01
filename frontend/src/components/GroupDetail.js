import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GroupChat from "../components/GroupChat";
import { AuthContext } from "../context/AuthContext";

function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user } = React.useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch group");
        }
        const selectedGroup = await response.json();
        if (!selectedGroup) {
          throw new Error("Group not found");
        }
        setGroup(selectedGroup);
      } catch (err) {
        setError(err.message || "Failed to load group");
      } finally {
        setIsLoading(false);
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleJoinGroup = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/join`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join group");
      }
      const updatedGroup = await response.json();
      setGroup(updatedGroup);
    } catch (err) {
      setError(err.message || "Failed to join group");
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg animate-pulse">
          Loading group details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mt-10 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up">
        {error}
      </div>
    );
  }

  const isMember = group.members.some((member) => member._id === user?.id);

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate("/study-groups")}
            className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-4 py-2 rounded-md hover:shadow-[0_0_10px_rgba(107,114,128,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
            aria-label="Back to Study Groups"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Study Groups</span>
          </button>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-orange-600 dark:to-amber-600 text-white text-2xl icon-hover transition-all duration-300">
              <i className={`fa-solid ${group.groupImage || "fa-users"}`}></i>
            </div>
            <h1 className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline">
              {group.name}
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-200 mb-3 italic transition-all duration-200">
            {group.description}
          </p>
          <p className="text-sm mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
            Category: {group.category}
          </p>
          <p className="text-sm mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
            Created by: {group.creator.username}
          </p>
          <p className="text-sm mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
            Members: {group.members.map((member) => member.username).join(", ")}
          </p>
          <div className="flex space-x-3 mb-6">
            {user && !isMember && (
              <button
                onClick={handleJoinGroup}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-1"
                aria-label={`Join ${group.name}`}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Join Group</span>
              </button>
            )}
          </div>
          {isMember ? (
            <GroupChat
              groupId={groupId}
              messages={group.messages}
              setGroup={setGroup}
              currentUser={user}
            />
          ) : (
            <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-200">
              Join the group to participate in the discussion board.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default GroupDetail;
