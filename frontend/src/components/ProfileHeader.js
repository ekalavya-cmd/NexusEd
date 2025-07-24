// 2. Fixed ProfileHeader.js
import React, { useRef, useCallback, useEffect } from "react";
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
  setUploadError,
  isLoading,
  imageLoadError,
  setImageLoadError,
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

  // Clear upload errors after 3 seconds
  useEffect(() => {
    if (uploadError) {
      const timer = setTimeout(() => {
        setUploadError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [uploadError, setUploadError]);

  // Use useCallback to memoize the onError handler to prevent infinite re-renders
  const handleImageError = useCallback(() => {
    if (!imageLoadError) {
      setImageLoadError(true);
    }
  }, [imageLoadError, setImageLoadError]);

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    handleProfilePictureChange(e, fileInputRef);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleBioUpdate(e);
  };

  const handleCancel = () => {
    setBio(user.bio || DEFAULT_BIO);
    setUsername(user.username);
    setIsEditing(false);
  };

  const handleRemoveImage = () => {
    handleRemoveProfilePicture(fileInputRef);
  };

  return (
    <Card className="profile-header-card shadow-lg mb-4 border-0 overflow-hidden">
      {/* Gradient Background Banner */}
      <div 
        className="profile-banner position-relative"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          height: "200px"
        }}
      >
        <div className="position-absolute w-100 h-100" style={{
          background: "rgba(0,0,0,0.1)",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3Ccircle cx='53' cy='7' r='7'/%3E%3Ccircle cx='7' cy='53' r='7'/%3E%3Ccircle cx='53' cy='53' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        {/* Floating decorative elements */}
        <div className="position-absolute" style={{ top: "20px", right: "30px", opacity: 0.3 }}>
          <i className="fas fa-graduation-cap text-white" style={{ fontSize: "2rem" }}></i>
        </div>
        <div className="position-absolute" style={{ top: "60px", right: "80px", opacity: 0.2 }}>
          <i className="fas fa-book text-white" style={{ fontSize: "1.5rem" }}></i>
        </div>
        <div className="position-absolute" style={{ top: "40px", left: "50px", opacity: 0.3 }}>
          <i className="fas fa-users text-white" style={{ fontSize: "1.8rem" }}></i>
        </div>
      </div>

      <Card.Body className="p-0">
        <div className="position-relative" style={{ marginTop: "-75px" }}>
          <Row className="align-items-end px-4">
            <Col md={3} className="text-center text-md-start mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                <div
                  className="rounded-circle overflow-hidden bg-white border-5 border-white shadow-lg position-relative"
                  style={{ width: "150px", height: "150px" }}
                >
                  {profilePicture && !imageLoadError ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}${profilePicture}`}
                      alt={username}
                      className="w-100 h-100 object-fit-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <div 
                      className="w-100 h-100 d-flex align-items-center justify-content-center"
                      style={{ 
                        background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                      }}
                    >
                      <i className="fas fa-user fs-1 text-white"></i>
                    </div>
                  )}
                  
                  {/* Online status indicator */}
                  <div 
                    className="position-absolute rounded-circle border-3 border-white"
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: "#22c55e",
                      bottom: "10px",
                      right: "10px"
                    }}
                  ></div>
                </div>

                {isCurrentUser && (
                  <div className="position-absolute" style={{ bottom: "40px", right: "-10px" }}>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="d-none"
                      accept="image/*"
                    />
                    <Button
                      variant="light"
                      size="sm"
                      className="rounded-circle p-2 shadow-sm"
                      onClick={handleFileInputClick}
                      disabled={isLoading}
                      style={{ 
                        width: "40px", 
                        height: "40px",
                        border: "2px solid #fff"
                      }}
                    >
                      {isLoading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        <i className="fas fa-camera text-primary"></i>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {uploadError && (
                <Alert variant="danger" className="mt-3 text-start small">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {uploadError}
                </Alert>
              )}
            </Col>

            <Col md={9} className="pt-4 pb-4">
              {isEditing ? (
                <div className="bg-white rounded-3 p-4 shadow-sm">
                  <Form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <Form.Label htmlFor="username" className="fw-semibold text-dark">
                        <i className="fas fa-user me-2 text-primary"></i>
                        Username
                      </Form.Label>
                      <InputGroup>
                        <Form.Control
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          minLength={USERNAME_MIN_LENGTH}
                          maxLength={USERNAME_MAX_LENGTH}
                          className="border-2 rounded-3"
                          required
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        {USERNAME_MIN_LENGTH}-{USERNAME_MAX_LENGTH} characters
                      </Form.Text>
                    </div>

                    <div className="mb-4">
                      <Form.Label htmlFor="bio" className="fw-semibold text-dark">
                        <i className="fas fa-quote-left me-2 text-primary"></i>
                        Bio
                      </Form.Label>
                      <Form.Control
                        id="bio"
                        as="textarea"
                        rows={4}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        maxLength={BIO_MAX_LENGTH}
                        placeholder={DEFAULT_BIO}
                        className="border-2 rounded-3"
                      />
                      <Form.Text className="text-muted d-flex justify-content-between">
                        <span>Tell others about yourself</span>
                        <span>{bio.length}/{BIO_MAX_LENGTH} characters</span>
                      </Form.Text>
                    </div>

                    <div className="d-flex gap-3">
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="px-4 rounded-3"
                      >
                        <i className="fas fa-times me-2"></i>
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isLoading}
                        className="px-4 rounded-3"
                      >
                        {isLoading ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-save me-2"></i>
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                </div>
              ) : (
                <div className="text-white pt-3">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <h1 className="display-6 fw-bold mb-2 text-shadow">{user.username}</h1>
                      <div className="d-flex align-items-center text-white-50">
                        <i className="fas fa-calendar-alt me-2"></i>
                        <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {isCurrentUser && (
                      <Button
                        variant="outline-light"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="rounded-3 px-3 shadow-sm backdrop-blur"
                        style={{ 
                          backdropFilter: "blur(10px)",
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.3)"
                        }}
                      >
                        <i className="fas fa-edit me-2"></i>
                        Edit Profile
                      </Button>
                    )}
                  </div>

                  <div className="bg-white bg-opacity-10 rounded-3 p-3 backdrop-blur mb-3" style={{ backdropFilter: "blur(10px)" }}>
                    <div className="d-flex align-items-start">
                      <i className="fas fa-quote-left text-white-50 me-3 mt-1"></i>
                      <p className="mb-0 text-white-75 lh-base">
                        {user.bio || DEFAULT_BIO}
                      </p>
                    </div>
                  </div>

                  {profilePicture && isCurrentUser && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={handleRemoveImage}
                      disabled={isLoading}
                      className="rounded-3 px-3 shadow-sm"
                      style={{ 
                        backgroundColor: "rgba(220, 53, 69, 0.1)",
                        borderColor: "rgba(220, 53, 69, 0.5)"
                      }}
                    >
                      <i className="fas fa-trash me-2"></i>
                      Remove Profile Picture
                    </Button>
                  )}
                </div>
              )}
            </Col>
          </Row>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProfileHeader;
