import React, { useState, useEffect, useRef } from "react";
import { Card, Form, Button, Spinner, InputGroup, Alert } from "react-bootstrap";

function PostForm({ handleCreatePost, studyGroupId = null }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const fileInputRef = useRef(null);
  const MAX_LENGTH = 500;

  // Clear errors after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Clear file errors after 3 seconds
  useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => {
        setFileError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setFileError("");

    // Check file size (10MB max per file)
    const hasLargeFile = files.some((file) => file.size > 10 * 1024 * 1024);
    if (hasLargeFile) {
      setFileError("Some files exceed the maximum size of 10MB.");
    }

    // Check file count (5 max)
    if (files.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim() && selectedFiles.length === 0) {
      setError("Post content cannot be empty or you must attach at least one file.");
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`Post content cannot exceed ${MAX_LENGTH} characters.`);
      return;
    }

    if (selectedFiles.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
      return;
    }

    setError("");
    setFileError("");
    setIsSubmitting(true);

    try {
      const success = await handleCreatePost(content, studyGroupId, selectedFiles);
      if (success) {
        setContent("");
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error("Error creating post:", err);
      setError("An error occurred while creating your post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title className="mb-3">
          <i className="fas fa-edit me-2 text-primary"></i>
          Create a Post
        </Card.Title>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              disabled={isSubmitting}
              maxLength={MAX_LENGTH}
            />
            <Form.Text
              className={
                content.length > MAX_LENGTH ? "text-danger" : "text-muted"
              }
            >
              {content.length}/{MAX_LENGTH} characters
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <Form.Control
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                disabled={isSubmitting}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
              />
              <Button
                variant="outline-secondary"
                onClick={() => fileInputRef.current.click()}
                disabled={isSubmitting}
              >
                <i className="fas fa-paperclip me-1"></i>
                Attach Files
              </Button>
            </InputGroup>
            <Form.Text className="text-muted">
              Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 5 files, 10MB each)
            </Form.Text>
          </Form.Group>

          {selectedFiles.length > 0 && (
            <div className="mb-3 p-2 bg-light rounded border">
              <small className="text-muted d-flex align-items-center mb-2">
                <i className="fas fa-paperclip me-1"></i>
                {selectedFiles.length} file(s) selected
              </small>
              <div>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="d-flex align-items-center justify-content-between mb-1">
                    <small className="text-truncate" style={{ fontSize: "0.8rem" }}>
                      <i className="fas fa-file me-1"></i>
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </small>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="py-2 mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </Alert>
          )}

          {fileError && (
            <Alert variant="danger" className="py-2 mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {fileError}
            </Alert>
          )}

          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              className="btn-hover-shadow"
              disabled={
                isSubmitting || (!content.trim() && selectedFiles.length === 0) || content.length > MAX_LENGTH
              }
            >
              {isSubmitting ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Posting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Post
                </>
              )}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default PostForm;
