import React from "react";
import { Link } from "react-router-dom";

const ProfileGroups = ({ joinedGroups, isGroupsLoading }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6 animate-fade-in-up">
        <h3 className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline">
          My Study Groups
        </h3>
      </div>
      <div className="space-y-6 animate-fade-in-up">
        {isGroupsLoading ? (
          <div className="text-gray-600 dark:text-gray-400 py-10">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 dark:border-gray-400"></div>
            <p className="mt-2">Loading study groups...</p>
          </div>
        ) : joinedGroups.length > 0 ? (
          joinedGroups.map((group, index) => (
            <div
              key={group._id}
              className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center space-x-4 mb-2">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-orange-600 dark:to-amber-600 text-white dark:text-gray-200 text-2xl transition-all duration-300">
                  <i
                    className={`fa-solid ${group.groupImage || "fa-users"}`}
                  ></i>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <Link to={`/groups/${group._id}`}>
                      <h4 className="relative text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline">
                        {group.name}
                      </h4>
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
                  <div className="flex flex-wrap space-x-4 text-sm">
                    <p className="bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
                      Members: <span>{group.members?.length || 0}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            You haven’t joined any study groups yet.
          </p>
        )}
      </div>
    </>
  );
};

export default ProfileGroups;
