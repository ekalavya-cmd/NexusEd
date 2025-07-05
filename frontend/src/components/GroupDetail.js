import React, { useState, useEffect, useContext, useRef } from "react";
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
  Form,
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
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const messageEndRef = useRef(null);
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
        setError("Failed to load group details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  const setTemporaryMessage = (message) => {
    setError(message);
    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(setTimeout(() => setError(""), 3000));
  };

  const setTemporarySuccess = (message) => {
    setSuccess(message);
    if (timeoutId) clearTimeout(timeoutId);
    setTimeoutId(setTimeout(() => setSuccess(""), 3000));
  };

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

  const handleLeaveGroup = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/leave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTemporarySuccess("You have left the group successfully!");
      navigate("/study-groups");
    } catch (err) {
      console.error("Error leaving group:", err);
      setTemporaryMessage("Failed to leave the group. Please try again.");
    }
  };

  const isUserMember =
    user && group?.members?.some((member) => member._id === user.id);
  const isGroupCreator = user && group?.creator?._id === user.id;

  if (authLoading || isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading group details...</p>
      </div>
    );
  }

  if (error && !group) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
        <Button variant="secondary" onClick={() => navigate("/study-groups")}>
          Back to Study Groups
        </Button>
      </Alert>
    );
  }

  if (!group) {
    return (
      <Alert variant="warning">
        <Alert.Heading>Group Not Found</Alert.Heading>
        <p>The study group you're looking for could not be found.</p>
        <Button variant="secondary" onClick={() => navigate("/study-groups")}>
          Back to Study Groups
        </Button>
      </Alert>
    );
  }

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

      <Card className="shadow-sm mb-4">
        <Card.Body className="p-4">
          <Row className="align-items-center">
            <Col md={8}>
              <div className="d-flex align-items-center mb-3">
                <div
                  className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                  style={{ width: "60px", height: "60px" }}
                >
                  <i
                    className={`fa-solid ${
                      group.groupImage || "fa-users"
                    } fs-3`}
                  ></i>
                </div>
                <div>
                  <h1 className="fs-3 fw-bold mb-0">{group.name}</h1>
                  {group.category && (
                    <Badge bg="primary" pill className="mt-1">
                      {group.category}
                    </Badge>
                  )}
                </div>
              </div>

              <p className="mb-3">{group.description}</p>

              <div className="d-flex flex-wrap gap-3 mb-3">
                <div className="d-flex align-items-center">
                  <i className="fas fa-users me-2 text-secondary"></i>
                  <span>{group.members.length} members</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-calendar-alt me-2 text-secondary"></i>
                  <span>{group.events?.length || 0} events</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-clock me-2 text-secondary"></i>
                  <span>
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => setShowMembers(!showMembers)}
                className="mb-3"
              >
                <i
                  className={`fas fa-chevron-${
                    showMembers ? "up" : "down"
                  } me-2`}
                ></i>
                {showMembers ? "Hide Members" : "Show Members"}
              </Button>

              {showMembers && (
                <div className="mb-3">
                  <h5 className="fs-6 fw-semibold mb-2">Members:</h5>
                  <div className="d-flex flex-wrap gap-2">
                    {group.members.map((member) => (
                      <div key={member._id} className="tooltip-container">
                        <div
                          className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "40px", height: "40px" }}
                        >
                          {member.username
                            ? member.username.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <span className="tooltip">
                          {member.username || "Unknown"}
                          {group.creator._id === member._id ? " (Creator)" : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Col>

            <Col md={4} className="text-md-end mt-3 mt-md-0">
              {user ? (
                isUserMember ? (
                  <div className="d-flex flex-column gap-2">
                    <Button
                      variant="outline-primary"
                      className="w-100"
                      onClick={() => navigate("/calendar")}
                    >
                      <i className="fas fa-calendar-alt me-2"></i>
                      View Events
                    </Button>

                    {!isGroupCreator && (
                      <Button
                        variant="outline-danger"
                        className="w-100"
                        onClick={handleLeaveGroup}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Leave Group
                      </Button>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    className="btn-hover-shadow"
                    onClick={() => {
                      // Handle join group logic
                    }}
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Join Group
                  </Button>
                )
              ) : (
                <Alert variant="info" className="mb-0 p-3">
                  <i className="fas fa-info-circle me-2"></i>
                  Please log in to join this group.
                </Alert>
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {isUserMember ? (
        <Tab.Container
          id="group-tabs"
          activeKey={activeTab}
          onSelect={setActiveTab}
        >
          <Card className="shadow-sm">
            <Card.Header className="bg-light py-3">
              <Nav variant="tabs">
                <Nav.Item>
                  <Nav.Link eventKey="discussion" className="px-4">
                    <i className="fas fa-comments me-2"></i>
                    Discussion
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="chat" className="px-4">
                    <i className="fas fa-comment-dots me-2"></i>
                    Live Chat
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Header>

            <Card.Body>
              <Tab.Content>
                <Tab.Pane eventKey="discussion">
                  <div className="mb-4">
                    <PostForm
                      handleCreatePost={handleCreatePost}
                      studyGroupId={groupId}
                    />
                  </div>

                  {posts.length === 0 ? (
                    <Alert variant="info">
                      <i className="fas fa-info-circle me-2"></i>
                      No posts yet. Be the first to start a discussion!
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
                  <GroupChat
                    group={group}
                    user={user}
                    setTemporaryMessage={setTemporaryMessage}
                    setTemporarySuccess={setTemporarySuccess}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Tab.Container>
      ) : (
        <Alert variant="warning" className="mt-4">
          <Alert.Heading>Members Only</Alert.Heading>
          <p>
            You need to join this group to view discussions and participate in
            chats.
          </p>
        </Alert>
      )}
    </div>
  );
}

export default GroupDetail;
