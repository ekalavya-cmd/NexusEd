import React from "react";
import { Row, Col, Tab, Nav, Spinner, Alert } from "react-bootstrap";
import useProfile from "../hooks/useProfile";
import ProfileHeader from "./ProfileHeader";
import ProfileGroups from "./ProfileGroups";
import UserPosts from "./UserPosts";

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
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="info" className="text-center py-5">
        <Alert.Heading>Not Logged In</Alert.Heading>
        <p>Please log in to view your profile.</p>
      </Alert>
    );
  }

  return (
    <div className="animate-fade-in-up">
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      <ProfileHeader
        user={user}
        bio={bio}
        setBio={setBio}
        username={username}
        setUsername={setUsername}
        profilePicture={profilePicture}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        uploadError={uploadError}
        isLoading={isLoading}
        imageLoadError={imageLoadError}
        handleProfilePictureChange={handleProfilePictureChange}
        handleRemoveProfilePicture={handleRemoveProfilePicture}
        handleBioUpdate={handleBioUpdate}
        BIO_MAX_LENGTH={BIO_MAX_LENGTH}
        USERNAME_MIN_LENGTH={USERNAME_MIN_LENGTH}
        USERNAME_MAX_LENGTH={USERNAME_MAX_LENGTH}
        DEFAULT_BIO={DEFAULT_BIO}
      />

      <Tab.Container id="profile-tabs" defaultActiveKey="posts">
        <Row className="mt-4">
          <Col>
            <Nav variant="tabs" className="mb-3">
              <Nav.Item>
                <Nav.Link eventKey="posts" className="px-4">
                  <i className="fas fa-comment-alt me-2"></i>
                  Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="groups" className="px-4">
                  <i className="fas fa-users me-2"></i>
                  Groups
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey="posts">
                <UserPosts
                  posts={posts}
                  setPosts={setPosts}
                  isLoading={isPostsLoading}
                  userId={user.id}
                  sortOption={sortOption}
                  setSortOption={setSortOption}
                  setTemporaryMessage={setTemporaryMessage}
                  setTemporarySuccess={setTemporarySuccess}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="groups">
                <ProfileGroups
                  groups={joinedGroups}
                  isLoading={isGroupsLoading}
                  setTemporaryMessage={setTemporaryMessage}
                  setTemporarySuccess={setTemporarySuccess}
                />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default Profile;
