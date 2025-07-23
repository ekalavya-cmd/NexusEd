import React, { useState, useEffect } from "react";
import { Card, Form, Button, Spinner } from "react-bootstrap";

function PostForm({ handleCreatePost, studyGroupId = null }) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Post content cannot be empty.");
      return;
    }

    if (content.length > MAX_LENGTH) {
      setError(`Post content cannot exceed ${MAX_LENGTH} characters.`);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const success = await handleCreatePost(content, studyGroupId);
      if (success) {
        setContent("");
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
              required
            />
            <Form.Text
              className={
                content.length > MAX_LENGTH ? "text-danger" : "text-muted"
              }
            >
              {content.length}/{MAX_LENGTH} characters
            </Form.Text>
          </Form.Group>

          {error && (
            <div className="alert alert-danger py-2 mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              className="btn-hover-shadow"
              disabled={
                isSubmitting || !content.trim() || content.length > MAX_LENGTH
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
