import React, { useRef } from "react";
import { Link } from "react-router-dom";

function GroupCard({
  group,
  user,
  visibleMembers,
  toggleMembersVisibility,
  handleEditGroup,
  handleDeleteConfirmation,
  handleJoinGroup,
  handleLeaveGroup,
  deleteConfirmation,
  handleDeleteGroup,
  cancelDeleteGroup,
  animationDelay,
}) {
  const toggleButtonRef = useRef(null);
  const joinButtonRef = useRef(null);
  const leaveButtonRef = useRef(null);

  const handleToggleMembers = () => {
    toggleMembersVisibility(group._id);
    if (visibleMembers[group._id] && toggleButtonRef.current) {
      toggleButtonRef.current.blur();
    }
  };

  const handleJoinClick = () => {
    handleJoinGroup(group._id);
    if (joinButtonRef.current) {
      joinButtonRef.current.blur();
    }
  };

  const handleLeaveClick = () => {
    handleLeaveGroup(group._id);
    if (leaveButtonRef.current) {
      leaveButtonRef.current.blur();
    }
  };

  return (
    <div
      className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div className="flex items-center space-x-4 mb-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-orange-600 dark:to-amber-600 text-white text-2xl icon-hover transition-all duration-300">
          <i className={`fa-solid ${group.groupImage || "fa-users"}`}></i>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <Link to={`/groups/${group._id}`}>
              <h3 className="relative text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline">
                {group.name}
              </h3>
            </Link>
            {group.category && (
              <span className="inline-block bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-blue-600 dark:to-indigo-600 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-xs font-medium">
                {group.category}
              </span>
            )}
          </div>
          <p className="text-gray-600 dark:text-gray-200 mb-2 italic transition-all duration-200">
            {group.description}
          </p>
          <div className="flex flex-wrap space-x-4 mb-3 text-sm">
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
              Creator: <span>{group.creator?.username || "Unknown"}</span>
            </p>
            <p className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
              Members: <span>{group.members?.length || 0}</span>
            </p>
          </div>
        </div>
      </div>

      {group.members?.length > 0 && (
        <div className="mb-3">
          <button
            onClick={handleToggleMembers}
            ref={toggleButtonRef}
            className="text-sm bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-600 dark:to-emerald-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(6,95,70,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-1"
            aria-label={
              visibleMembers[group._id]
                ? `Hide members of ${group.name}`
                : `Show members of ${group.name}`
            }
          >
            <i
              className={
                visibleMembers[group._id]
                  ? "fa-solid fa-chevron-up"
                  : "fa-solid fa-chevron-down"
              }
            ></i>
            <span>
              {visibleMembers[group._id] ? "Hide Members" : "Show Members"}
            </span>
          </button>
          {visibleMembers[group._id] && (
            <div className="mt-2 flex flex-wrap gap-2">
              {group.members.map((member) => (
                <div
                  key={member._id}
                  className="relative avatar flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-purple-600 dark:to-indigo-600 text-white text-xs font-medium cursor-pointer transition-all duration-300 hover:scale-110"
                >
                  <span>
                    {member.username
                      ? member.username.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                  <span className="tooltip">
                    {member.username || "Unknown"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {user && (
        <div className="flex items-center space-x-3">
          {group.members?.some((member) => member._id === user.id) ? (
            group.creator._id === user.id ? (
              <>
                <button
                  onClick={() => handleEditGroup(group)}
                  className="bg-gradient-to-r from-yellow-600 to-yellow-800 dark:from-yellow-700 dark:to-yellow-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
                  aria-label={`Edit ${group.name}`}
                >
                  <i className="fa-solid fa-edit"></i>
                  <span>Edit Group</span>
                </button>
                <button
                  onClick={() => handleDeleteConfirmation(group._id)}
                  className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
                  aria-label={`Delete ${group.name}`}
                >
                  <i className="fa-solid fa-trash"></i>
                  <span>Delete Group</span>
                </button>
              </>
            ) : (
              <button
                onClick={handleLeaveClick}
                ref={leaveButtonRef}
                className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
                aria-label={`Leave ${group.name}`}
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span>Leave Group</span>
              </button>
            )
          ) : (
            <button
              onClick={handleJoinClick}
              ref={joinButtonRef}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
              aria-label={`Join ${group.name}`}
            >
              <i className="fa-solid fa-right-to-bracket"></i>
              <span>Join Group</span>
            </button>
          )}
        </div>
      )}
      {deleteConfirmation === group._id && (
        <div className="mt-3 bg-yellow-100 dark:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300 p-4 rounded-lg border border-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800 dark:to-yellow-700 shadow-md hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up flex justify-between items-center">
          <span>
            Are you sure you want to delete "{group.name}"? This action cannot
            be undone.
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDeleteGroup(group._id)}
              className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
              aria-label={`Confirm Delete ${group.name}`}
            >
              Yes
            </button>
            <button
              onClick={cancelDeleteGroup}
              className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(107,114,128,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
              aria-label={`Cancel Delete ${group.name}`}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupCard;
