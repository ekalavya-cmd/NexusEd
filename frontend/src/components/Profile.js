import React from "react";
import useProfile from "../hooks/useProfile";
import ProfileHeader from "./ProfileHeader";
import StudyGroups from "./ProfileGroups";
import UserPosts from "./UserPosts";
import { profileStyles } from "../styles/profileStyles";

function Profile() {
  const {
    user,
    setUser,
    authLoading,
    posts,
    setPosts,
    isPostsLoading,
    joinedGroups,
    isGroupsLoading,
    bio,
    setBio,
    username,
    setUsername,
    profilePicture,
    setProfilePicture,
    isEditing,
    setIsEditing,
    error,
    setError,
    uploadError,
    setUploadError,
    success,
    setSuccess,
    isLoading,
    setIsLoading,
    sortOption,
    setSortOption,
    imageLoadError,
    setImageLoadError,
    setTemporaryMessage,
    setTemporarySuccess,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
    handleBioUpdate,
    BIO_MAX_LENGTH,
    USERNAME_MIN_LENGTH,
    USERNAME_MAX_LENGTH,
    DEFAULT_BIO,
  } = useProfile();

  if (authLoading) {
    return (
      <div className="text-gray-600 dark:text-gray-400 py-10 animate-pulse">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-gray-600 dark:text-gray-400 py-10 text-center">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <style>{profileStyles}</style>
      <div className="container mx-auto px-4 py-10">
        <ProfileHeader
          user={user}
          bio={bio}
          setBio={setBio}
          username={username}
          setUsername={setUsername}
          profilePicture={profilePicture}
          setProfilePicture={setProfilePicture}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          error={error}
          setError={setError}
          success={success}
          setSuccess={setSuccess}
          uploadError={uploadError}
          isLoading={isLoading}
          handleProfilePictureChange={handleProfilePictureChange}
          handleBioUpdate={handleBioUpdate}
          imageLoadError={imageLoadError}
          setImageLoadError={setImageLoadError}
          posts={posts}
          joinedGroups={joinedGroups}
          BIO_MAX_LENGTH={BIO_MAX_LENGTH}
          USERNAME_MIN_LENGTH={USERNAME_MIN_LENGTH}
          USERNAME_MAX_LENGTH={USERNAME_MAX_LENGTH}
          DEFAULT_BIO={DEFAULT_BIO}
          setTemporaryMessage={setTemporaryMessage}
          setTemporarySuccess={setTemporarySuccess}
          handleRemoveProfilePicture={handleRemoveProfilePicture}
        />
        <StudyGroups
          joinedGroups={joinedGroups}
          isGroupsLoading={isGroupsLoading}
        />
        <UserPosts
          posts={posts}
          isPostsLoading={isPostsLoading}
          sortOption={sortOption}
          setSortOption={setSortOption}
          setPosts={setPosts}
          currentUser={user}
        />
      </div>
    </div>
  );
}

export default Profile;
