import React, { useState, useRef } from "react";
import { Card, Button, Form, Badge, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

function PostCard({
  post,
  currentUser,
  handleLikePost,
  handleDeletePost,
  handleAddComment,
  handleDeleteComment,
  isLiking = false,
  isDeleting = false,
  isCommenting = false,
  animationDelay,
}) {
  const [commentContent, setCommentContent] = useState("");
  const [showComments, setShowComments] = useState(false);
  const likeButtonRef = useRef(null);
  const deleteButtonRef = useRef(null);
  const commentButtonRef = useRef(null);

  const handleLikeClick = () => {
    handleLikePost(post._id);
    if (likeButtonRef.current) {
      likeButtonRef.current.blur();
    }
  };

  const handleDeleteClick = () => {
    handleDeletePost(post._id);
    if (deleteButtonRef.current) {
      deleteButtonRef.current.blur();
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentContent.trim()) {
      handleAddComment(post._id, commentContent);
      setCommentContent("");
    }
  };

  const handleCommentKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleCommentSubmit(e);
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const userHasLiked = currentUser && post.likes.includes(currentUser.id);

  return (
    <Card
      className="shadow-sm mb-4 animate-fade-in-up"
      style={{ animationDelay }}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-gradient-primary rounded-circle text-white d-flex align-items-center justify-content-center"
            style={{ width: "40px", height: "40px" }}
          >
            <i className="fas fa-user"></i>
          </div>
          <div className="ms-3">
            <h6 className="mb-0 fw-bold">
              {post.author?.username || "Unknown User"}
            </h6>
            <small className="text-muted">{formatDate(post.createdAt)}</small>
          </div>
          {currentUser && currentUser.id === post.author?._id && (
            <Button
              variant="outline-danger"
              size="sm"
              className="ms-auto"
              onClick={handleDeleteClick}
              ref={deleteButtonRef}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <i className="fas fa-trash"></i>
              )}
            </Button>
          )}
        </div>

        <Card.Text className="mb-3">{post.content}</Card.Text>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Button
              variant={userHasLiked ? "primary" : "outline-primary"}
              size="sm"
              className="me-2"
              onClick={handleLikeClick}
              ref={likeButtonRef}
              disabled={isLiking || !currentUser}
            >
              {isLiking ? (
                <span
                  className="spinner-border spinner-border-sm me-1"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <i
                  className={`fas fa-thumbs-up me-1 ${
                    userHasLiked ? "text-white" : ""
                  }`}
                ></i>
              )}
              {post.likes.length}
            </Button>

            <Button
              variant="outline-secondary"
              size="sm"
              onClick={toggleComments}
            >
              <i className={`fas fa-comment me-1`}></i>
              {post.comments.length}
            </Button>
          </div>

          <small className="text-muted">
            {post.studyGroup && (
              <Link
                to={`/groups/${post.studyGroup._id}`}
                className="text-decoration-none"
              >
                <Badge bg="info" className="ms-2">
                  <i className="fas fa-users me-1"></i>
                  {post.studyGroup.name}
                </Badge>
              </Link>
            )}
          </small>
        </div>

        {(showComments || post.comments.length === 0) && (
          <>
            {post.comments.length > 0 && (
              <ListGroup variant="flush" className="border-top pt-2 mb-3">
                {post.comments.map((comment) => (
                  <ListGroup.Item
                    key={comment._id}
                    className="px-0 py-2 border-0"
                  >
                    <div className="d-flex">
                      <div
                        className="bg-secondary rounded-circle text-white d-flex align-items-center justify-content-center"
                        style={{
                          width: "30px",
                          height: "30px",
                          fontSize: "12px",
                        }}
                      >
                        {comment.author?.username
                          ? comment.author.username.charAt(0).toUpperCase()
                          : "U"}
                      </div>
                      <div className="ms-2 flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">
                            {comment.author?.username || "Unknown"}
                          </span>
                          <small className="text-muted">
                            {formatDate(comment.createdAt)}
                          </small>
                        </div>
                        <p className="mb-0">{comment.content}</p>
                      </div>
                      {currentUser &&
                        currentUser.id === comment.author?._id && (
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0 ms-2"
                            onClick={() =>
                              handleDeleteComment(post._id, comment._id)
                            }
                          >
                            <i className="fas fa-times"></i>
                          </Button>
                        )}
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}

            {currentUser && (
              <Form onSubmit={handleCommentSubmit}>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    onKeyDown={handleCommentKeyDown}
                    placeholder="Add a comment"
                    disabled={isCommenting}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  ref={commentButtonRef}
                  disabled={isCommenting || !commentContent.trim()}
                >
                  {isCommenting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Commenting...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-comment me-1"></i>
                      Comment
                    </>
                  )}
                </Button>
              </Form>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default PostCard;
