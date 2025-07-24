import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Card,
  Row,
  Col,
  Badge,
  Button,
  Spinner,
  Alert,
  Tab,
  Nav,
} from "react-bootstrap";
import axios from "axios";
import PostForm from "./PostForm";
import PostCard from "./PostCard";
import GroupChat from "./GroupChat";
import ConfirmationMessage from "./ConfirmationMessage";

function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [group, setGroup] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("discussion");
  const [isLiking, setIsLiking] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}`
        );
        setGroup(response.data);

        // Fetch group posts
        const postsResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/posts/group/${groupId}`
        );
        setPosts(postsResponse.data);
      } catch (err) {
        console.error("Error fetching group details:", err);
        // Only show error if it's not a 404 (group not found) or 403 (unauthorized)
        if (err.response?.status !== 404 && err.response?.status !== 403) {
          setError("Failed to load group details. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const setTemporaryMessage = (message) => {
    setError(message);
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      setError("");
      setTimeoutId(null);
    }, 3000);
    setTimeoutId(newTimeoutId);
  };

  const setTemporarySuccess = (message) => {
    setSuccess(message);
    if (timeoutId) clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => {
      setSuccess("");
      setTimeoutId(null);
    }, 3000);
    setTimeoutId(newTimeoutId);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleCreatePost = async (content) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts`,
        { content, studyGroup: groupId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPosts([response.data, ...posts]);
      setTemporarySuccess("Post created successfully!");
      return true;
    } catch (err) {
      console.error("Error creating post:", err);
      setTemporaryMessage("Failed to create post. Please try again.");
      return false;
    }
  };

  const handleLikePost = async (postId) => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
    } catch (err) {
      console.error("Error liking post:", err);
      setTemporaryMessage("Failed to like post. Please try again.");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(posts.filter((post) => post._id !== postId));
      setTemporarySuccess("Post deleted successfully!");
    } catch (err) {
      console.error("Error deleting post:", err);
      setTemporaryMessage("Failed to delete post. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddComment = async (postId, content) => {
    if (isCommenting) return;

    try {
      setIsCommenting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments`,
        { content },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
      setTemporarySuccess("Comment added successfully!");
    } catch (err) {
      console.error("Error adding comment:", err);
      setTemporaryMessage("Failed to add comment. Please try again.");
    } finally {
      setIsCommenting(false);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPosts(
        posts.map((post) => (post._id === postId ? response.data : post))
      );
      setTemporarySuccess("Comment deleted successfully!");
    } catch (err) {
      console.error("Error deleting comment:", err);
      setTemporaryMessage("Failed to delete comment. Please try again.");
    }
  };

  const handleJoinGroup = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/join`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroup(response.data);
      setTemporarySuccess("Successfully joined the group!");
    } catch (err) {
      console.error("Error joining group:", err);
      setTemporaryMessage("Failed to join group. Please try again.");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroup(response.data);
      setTemporarySuccess("Successfully left the group!");
    } catch (err) {
      console.error("Error leaving group:", err);
      setTemporaryMessage("Failed to leave group. Please try again.");
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading group details...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="text-center py-5">
        <Alert variant="danger">
          <Alert.Heading>Group Not Found</Alert.Heading>
          <p>The study group you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button variant="primary" onClick={() => navigate("/study-groups")}>
            Back to Study Groups
          </Button>
        </Alert>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-5">
        <Alert variant="warning">
          <Alert.Heading>Authentication Required</Alert.Heading>
          <p>You must be logged in to view group details.</p>
          <Button variant="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Alert>
      </div>
    );
  }

  const isMember =
    user && group.members?.some((member) => member._id === user.id);
  const isCreator = user && group.creator._id === user.id;

  return (
    <div className="animate-fade-in-up">
      {error && (
        <ConfirmationMessage
          message={error}
          type="error"
          onClose={() => setError("")}
        />
      )}
      {success && (
        <ConfirmationMessage
          message={success}
          type="success"
          onClose={() => setSuccess("")}
        />
      )}

      {/* Group Header */}
      <Card className="mb-4 shadow-sm">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                  <i
                    className={`fas ${group.groupImage} fs-2 text-primary bg-light rounded-circle p-3`}
                  ></i>
                </div>
                <div>
                  <h1 className="fs-3 fw-bold mb-1">{group.name}</h1>
                  <div className="d-flex align-items-center gap-3">
                    <Badge bg="primary">{group.category}</Badge>
                    <span className="text-muted">
                      <i className="fas fa-users me-1"></i>
                      {group.members?.length || 0} members
                    </span>
                    <span className="text-muted">
                      Created by {group.creator.username}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-secondary mb-0">{group.description}</p>
            </Col>
            <Col md={4} className="text-end">
              {user && !isMember && (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleJoinGroup}
                  className="btn-hover-shadow"
                >
                  <i className="fas fa-plus me-2"></i>
                  Join Group
                </Button>
              )}
              {user && isMember && !isCreator && (
                <Button
                  variant="outline-danger"
                  size="lg"
                  onClick={handleLeaveGroup}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Leave Group
                </Button>
              )}
            </Col>
          </Row>

          {/* Members Section */}
          <Row className="mt-4">
            <Col>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="fw-semibold text-primary mb-0">
                  Members ({group.members?.length || 0})
                </h5>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowMembers(!showMembers)}
                  className="text-decoration-none"
                >
                  {showMembers ? "Hide" : "Show"} Members
                  <i
                    className={`fas fa-chevron-${
                      showMembers ? "up" : "down"
                    } ms-1`}
                  ></i>
                </Button>
              </div>
              {showMembers && (
                <div className="mt-3">
                  <Row xs={2} md={3} lg={4} className="g-2">
                    {group.members?.map((member) => (
                      <Col key={member._id}>
                        <div className="d-flex align-items-center p-2 bg-light rounded">
                          <i className="fas fa-user-circle me-2 text-secondary"></i>
                          <span className="small">{member.username}</span>
                          {member._id === group.creator._id && (
                            <Badge bg="success" className="ms-auto small">
                              Creator
                            </Badge>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="discussion" className="px-4">
              <i className="fas fa-comments me-2"></i>
              Discussion ({posts.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="chat" className="px-4">
              <i className="fas fa-comment-dots me-2"></i>
              Chat & Events
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="discussion">
            {user && isMember && (
              <div className="mb-4">
                <PostForm handleCreatePost={handleCreatePost} />
              </div>
            )}

            {posts.length === 0 ? (
              <Alert variant="info">
                <i className="fas fa-info-circle me-2"></i>
                No posts yet.{" "}
                {isMember && "Be the first to start a discussion!"}
              </Alert>
            ) : (
              posts.map((post, index) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
                  handleLikePost={handleLikePost}
                  handleDeletePost={handleDeletePost}
                  handleAddComment={handleAddComment}
                  handleDeleteComment={handleDeleteComment}
                  isLiking={isLiking}
                  isDeleting={isDeleting}
                  isCommenting={isCommenting}
                  animationDelay={`${index * 0.1}s`}
                />
              ))
            )}
          </Tab.Pane>

          <Tab.Pane eventKey="chat">
            {user && isMember ? (
              <GroupChat
                group={group}
                user={user}
                setTemporaryMessage={setTemporaryMessage}
                setTemporarySuccess={setTemporarySuccess}
              />
            ) : (
              <Alert variant="warning">
                <i className="fas fa-lock me-2"></i>
                You must be a member to access the group chat and events.
              </Alert>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
}

export default GroupDetail;
