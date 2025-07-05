import React, { useRef } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  Alert,
  Spinner,
} from "react-bootstrap";

function ProfileHeader({
  user,
  bio,
  setBio,
  username,
  setUsername,
  profilePicture,
  isEditing,
  setIsEditing,
  uploadError,
  isLoading,
  imageLoadError,
  handleProfilePictureChange,
  handleRemoveProfilePicture,
  handleBioUpdate,
  BIO_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  DEFAULT_BIO,
}) {
  const fileInputRef = useRef(null);
  const isCurrentUser = true; // In a real app, check if the profile belongs to the logged-in user

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBioUpdate();
  };

  const handleCancel = () => {
    setBio(user.bio || DEFAULT_BIO);
    setUsername(user.username);
    setIsEditing(false);
  };

  return (
    <Card className="shadow-sm">
      <Card.Body className="p-4">
        <Row className="align-items-center">
          <Col md={3} className="text-center text-md-start mb-4 mb-md-0">
            <div className="position-relative d-inline-block">
              <div
                className="rounded-circle overflow-hidden bg-light border"
                style={{ width: "150px", height: "150px" }}
              >
                {profilePicture ? (
                  <img
                    src={profilePicture}
                    alt={username}
                    className="w-100 h-100 object-fit-cover"
                    onError={() => setImageLoadError(true)}
                    style={{ display: imageLoadError ? "none" : "block" }}
                  />
                ) : (
                  <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                    <i className="fas fa-user fs-1 text-secondary"></i>
                  </div>
                )}
              </div>

              {isCurrentUser && (
                <div className="position-absolute bottom-0 end-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleProfilePictureChange}
                    className="d-none"
                    accept="image/*"
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    className="rounded-circle p-2"
                    onClick={handleFileInputClick}
                  >
                    <i className="fas fa-camera"></i>
                  </Button>
                </div>
              )}
            </div>

            {uploadError && (
              <Alert variant="danger" className="mt-2 text-start small p-2">
                <i className="fas fa-exclamation-circle me-1"></i>
                {uploadError}
              </Alert>
            )}
          </Col>

          <Col md={9}>
            {isEditing ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={USERNAME_MAX_LENGTH}
                    required
                  />
                  <Form.Text className="text-muted">
                    {username.length}/{USERNAME_MAX_LENGTH} characters (min{" "}
                    {USERNAME_MIN_LENGTH})
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    maxLength={BIO_MAX_LENGTH}
                  />
                  <Form.Text className="text-muted">
                    {bio.length}/{BIO_MAX_LENGTH} characters
                  </Form.Text>
                </Form.Group>

                <div className="d-flex justify-content-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={
                      isLoading || username.length < USERNAME_MIN_LENGTH
                    }
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          className="me-1"
                        />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </Form>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h1 className="fs-3 fw-bold mb-1">{user.username}</h1>
                    <p className="text-secondary mb-3">
                      Member since{" "}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {isCurrentUser && (
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                      >
                        <i className="fas fa-edit me-1"></i>
                        Edit Profile
                      </Button>
                    </div>
                  )}
                </div>

                <p className="mb-2">{user.bio || DEFAULT_BIO}</p>

                {profilePicture && isCurrentUser && (
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={handleRemoveProfilePicture}
                    disabled={isLoading}
                  >
                    <i className="fas fa-trash me-1"></i>
                    Remove profile picture
                  </Button>
                )}
              </>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}

export default ProfileHeader;
