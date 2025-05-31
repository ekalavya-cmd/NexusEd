import React, { useRef, useState, useEffect } from "react";
import { formatDateTime } from "../utils/formatUtils";

const ProfileHeader = ({
  user,
  bio,
  setBio,
  username,
  setUsername,
  profilePicture,
  setProfilePicture,
  isEditing,
  setIsEditing,
  error,
  success,
  uploadError,
  isLoading,
  handleProfilePictureChange,
  handleBioUpdate,
  imageLoadError,
  setImageLoadError,
  posts,
  joinedGroups,
  BIO_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  DEFAULT_BIO,
  setTemporaryMessage,
  setTemporarySuccess,
  handleRemoveProfilePicture,
}) => {
  const fileInputRef = useRef(null);
  const usernameRef = useRef(null);
  const bioRef = useRef(null);
  const saveButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [showPictureOptions, setShowPictureOptions] = useState(false);
  const [clickedButton, setClickedButton] = useState(null);

  useEffect(() => {
    if (!user.profilePicture) {
      setImageLoadError(false);
    }
  }, [user.profilePicture, setImageLoadError]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (bioRef.current) {
        bioRef.current.focus();
      }
    }
  };

  const handleBioKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setBio(bio + "\n");
      } else {
        e.preventDefault();
        saveButtonRef.current.focus();
      }
    }
  };

  const handleSaveKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      cancelButtonRef.current.focus();
    }
  };

  const handleCancelKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      saveButtonRef.current.focus();
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBio(user.bio || DEFAULT_BIO);
    setUsername(user.username || "");
    setTemporaryMessage(
      () => {},
      () => {},
      ""
    );
    setTemporarySuccess(
      () => {},
      () => {},
      ""
    );
  };

  const togglePictureOptions = () => {
    setShowPictureOptions((prev) => !prev);
  };

  const profilePictureUrl = user.profilePicture
    ? `${process.env.REACT_APP_API_URL}${
        user.profilePicture
      }?t=${new Date().getTime()}`
    : null;

  const totalLikes = posts.reduce(
    (sum, post) => sum + (post.likes?.length || 0),
    0
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 mb-8 animate-fade-in-up hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] transition-all duration-300">
      <div className="flex flex-col sm:flex-row items-start space-y-6 sm:space-y-0 sm:space-x-8 mb-6">
        <div className="relative">
          <div onClick={togglePictureOptions} className="cursor-pointer">
            {profilePictureUrl && !imageLoadError ? (
              <img
                src={profilePictureUrl}
                alt={`${user.username}'s profile picture`}
                className="w-28 h-28 rounded-full object-cover border-4 border-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)] transition-transform duration-300 hover:scale-105 aspect-[5/4]"
                aria-label={`${user.username}'s profile picture`}
                onError={() => setImageLoadError(true)}
              />
            ) : (
              <div
                className="w-28 h-28 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400 text-white dark:text-gray-200 flex items-center justify-center rounded-full text-4xl font-bold border-4 border-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400 shadow-[0_0_10px_rgba(59,130,246,0.3)] dark:shadow-[0_0_10px_rgba(209,213,219,0.3)] transition-transform duration-300 hover:scale-105 aspect-[5/4]"
                aria-label={`${user.username}'s avatar`}
              >
                {user.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {showPictureOptions && (
            <div className="absolute top-full mt-2 left-4 flex gap-2 z-10">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-full shadow-lg">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  onMouseDown={() => setClickedButton("add")}
                  onMouseUp={() => setClickedButton(null)}
                  className={`bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-purple-600 dark:to-indigo-600 text-white dark:text-gray-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-blue-700 dark:hover:bg-indigo-700 hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(88,28,135,0.5)] dark:hover:dark-glow transition-all duration-300 ${
                    clickedButton === "add"
                      ? "ring-2 ring-offset-2 ring-blue-500/50 dark:ring-purple-500/50"
                      : ""
                  }`}
                  aria-label={
                    profilePictureUrl
                      ? "Update profile picture"
                      : "Add profile picture"
                  }
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-plus"></i>
                </button>
              </div>
              {profilePictureUrl && (
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full shadow-lg">
                  <button
                    onClick={() => {
                      handleRemoveProfilePicture(fileInputRef);
                      setShowPictureOptions(false);
                    }}
                    onMouseDown={() => setClickedButton("delete")}
                    onMouseUp={() => setClickedButton(null)}
                    className={`bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 w-10 h-10 flex items-center justify-center rounded-full hover:bg-red-800 dark:hover:bg-red-500 hover:scale-105 hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(220,38,38,0.5)] dark:hover:dark-glow transition-all duration-300 ${
                      clickedButton === "delete"
                        ? "ring-2 ring-offset-2 ring-red-500/50 dark:ring-red-500/50"
                        : ""
                    }`}
                    aria-label="Delete profile picture"
                    disabled={isLoading}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              )}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleProfilePictureChange(e, fileInputRef)}
            accept="image/*"
            className="hidden"
            aria-label="Profile picture upload"
          />
          {uploadError && (
            <div className="absolute top-full mt-3 bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-2 rounded-md flex items-center space-x-2 text-sm w-48 shadow-md">
              <i className="fa-solid fa-exclamation-circle"></i>
              <span>{uploadError}</span>
            </div>
          )}
        </div>
        <div className="w-full">
          {isEditing ? (
            <>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Update your username"
                className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 transition-all duration-300 mb-2 text-2xl font-bold text-gray-800 dark:text-amber-200 shadow-sm"
                maxLength={USERNAME_MAX_LENGTH}
                ref={usernameRef}
                aria-label="Username"
              />
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                {username.length}/{USERNAME_MAX_LENGTH} characters
              </p>
            </>
          ) : (
            <h2 className="relative text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline transition-all duration-300">
              {user.username}
            </h2>
          )}
          <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 mt-1">
            {user.email}
          </p>
          <div className="flex flex-wrap space-x-4 mt-3 text-sm text-gray-600 dark:text-gray-200">
            <p className="font-semibold transition-transform duration-300 hover:scale-105">
              Posts: <span className="dark:text-gray-400">{posts.length}</span>
            </p>
            <p className="font-semibold transition-transform duration-300 hover:scale-105">
              Total Likes:{" "}
              <span className="dark:text-gray-400">{totalLikes}</span>
            </p>
            <p className="font-semibold transition-transform duration-300 hover:scale-105">
              Groups:{" "}
              <span className="dark:text-gray-400">{joinedGroups.length}</span>
            </p>
            {user.createdAt && (
              <p className="font-semibold transition-transform duration-300 hover:scale-105">
                Joined:{" "}
                <span className="dark:text-gray-400">
                  {formatDateTime(user.createdAt)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      {isEditing ? (
        <form onSubmit={handleBioUpdate} className="animate-fade-in-up">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            onKeyDown={handleBioKeyDown}
            placeholder="Update your bio"
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 transition-all duration-300 mb-2 text-gray-800 dark:text-gray-200 shadow-sm"
            rows="4"
            maxLength={BIO_MAX_LENGTH}
            ref={bioRef}
            aria-label="Bio"
          />
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            {bio.length}/{BIO_MAX_LENGTH} characters
          </p>
          {error && (
            <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-3 mb-4 rounded-md flex items-center space-x-2 shadow-md">
              <i className="fa-solid fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          )}
          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-teal-600 hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              disabled={isLoading}
              onKeyDown={handleSaveKeyDown}
              ref={saveButtonRef}
              aria-label="Save Profile"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              onKeyDown={handleCancelKeyDown}
              className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-5 py-2 rounded-lg hover:shadow-[0_0_10px_rgba(107,114,128,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
              ref={cancelButtonRef}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-gray-700 dark:text-gray-200 mb-4 italic">
            {user.bio || DEFAULT_BIO}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-green-600 dark:to-emerald-600 text-white dark:text-gray-200 px-5 py-2 rounded-lg hover:bg-blue-700 dark:hover:bg-emerald-600 hover:scale-105 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(6,95,70,0.5)] dark:hover:dark-glow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-2"
            aria-label="Edit Profile"
          >
            <i className="fa-solid fa-pen text-base"></i>
            <span>Edit Profile</span>
          </button>
          {success && (
            <div className="bg-green-100 dark:bg-green-900/70 text-green-700 dark:text-green-300 p-3 mt-4 rounded-md flex items-center space-x-2 shadow-md">
              <i className="fa-solid fa-check-circle"></i>
              <span>{success}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileHeader;
