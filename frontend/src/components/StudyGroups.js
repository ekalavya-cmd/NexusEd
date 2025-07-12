import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import GroupForm from "./GroupForm";
import GroupCard from "./GroupCard";
import ConfirmationMessage from "./ConfirmationMessage";

function StudyGroups() {
  const { user, isLoading: authLoading } = useContext(AuthContext);
  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    category: "",
    groupImage: "fa-users",
  });
  const [editGroup, setEditGroup] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [visibleMembers, setVisibleMembers] = useState({});
  const [confirmation, setConfirmation] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const timeoutRef = useRef(null);
  const confirmationTimeoutRef = useRef(null);
  const confirmationMessageRef = useRef(null);
  const editFormRef = useRef(null);

  const categories = [
    "Mathematics",
    "Programming",
    "Literature",
    "Science",
    "History",
  ];

  const groupIcons = [
    { value: "fa-users", label: "Users (Default)", icon: "fa-users" },
    { value: "fa-book", label: "Book", icon: "fa-book" },
    { value: "fa-code", label: "Code", icon: "fa-code" },
    { value: "fa-flask", label: "Flask (Science)", icon: "fa-flask" },
    { value: "fa-history", label: "History", icon: "fa-history" },
    {
      value: "fa-calculator",
      label: "Calculator (Math)",
      icon: "fa-calculator",
    },
  ];

  const setTemporaryMessage = (type, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (type === "error") {
      setError(message);
      setSuccess("");
    } else {
      setSuccess(message);
      setError("");
    }
    timeoutRef.current = setTimeout(() => {
      setError("");
      setSuccess("");
      timeoutRef.current = null;
    }, 3000);
  };

  const clearConfirmation = () => {
    if (confirmationTimeoutRef.current) {
      clearTimeout(confirmationTimeoutRef.current);
    }
    setConfirmation(null);
    confirmationTimeoutRef.current = null;
  };

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/study-groups`
        );
        setGroups(response.data);
      } catch (err) {
        console.error("Error fetching study groups:", err);
        setTemporaryMessage("error", "Failed to load study groups.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!user) {
      setTemporaryMessage("error", "Please log in to create a group.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups`,
        newGroup,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroups([response.data, ...groups]);
      setNewGroup({
        name: "",
        description: "",
        category: "",
        groupImage: "fa-users",
      });
      setShowCreateModal(false);
      setTemporaryMessage("success", "Study group created successfully!");
    } catch (err) {
      console.error("Error creating study group:", err);
      setTemporaryMessage("error", "Failed to create study group.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!user || !editGroup) return;

    try {
      setIsLoading(true);
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${editGroup._id}`,
        editGroup,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroups(
        groups.map((group) =>
          group._id === editGroup._id ? response.data : group
        )
      );
      setEditGroup(null);
      setTemporaryMessage("success", "Study group updated successfully!");
    } catch (err) {
      console.error("Error updating study group:", err);
      setTemporaryMessage("error", "Failed to update study group.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async (groupId) => {
    if (!user) {
      setTemporaryMessage("error", "Please log in to join a group.");
      return;
    }

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
      setGroups(
        groups.map((group) => (group._id === groupId ? response.data : group))
      );
      setTemporaryMessage("success", "Successfully joined the group!");
    } catch (err) {
      console.error("Error joining group:", err);
      setTemporaryMessage("error", "Failed to join group.");
    }
  };

  const handleLeaveGroup = async (groupId) => {
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
      setGroups(
        groups.map((group) => (group._id === groupId ? response.data : group))
      );
      setTemporaryMessage("success", "Successfully left the group!");
    } catch (err) {
      console.error("Error leaving group:", err);
      setTemporaryMessage("error", "Failed to leave group.");
    }
  };

  const handleDeleteConfirmation = (group) => {
    setDeleteConfirmation(group);
  };

  const handleDeleteGroup = async (groupId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setGroups(groups.filter((group) => group._id !== groupId));
      setDeleteConfirmation(null);
      setTemporaryMessage("success", "Study group deleted successfully!");
    } catch (err) {
      console.error("Error deleting study group:", err);
      setTemporaryMessage("error", "Failed to delete study group.");
    }
  };

  const cancelDeleteGroup = () => {
    setDeleteConfirmation(null);
  };

  const handleEditGroup = (group) => {
    setEditGroup({ ...group });
  };

  const cancelEditGroup = () => {
    setEditGroup(null);
  };

  const toggleMembersVisibility = (groupId) => {
    setVisibleMembers((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  const filteredGroups =
    selectedCategory === "All"
      ? groups
      : groups.filter((group) => group.category === selectedCategory);

  if (authLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading...</p>
      </div>
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
      {confirmation && (
        <ConfirmationMessage
          message={confirmation}
          type="success"
          onClose={clearConfirmation}
          ref={confirmationMessageRef}
        />
      )}

      <h1 className="display-6 fw-bold text-primary mb-4">Study Groups</h1>

      {user && (
        <div className="mb-4 text-end">
          <Button
            variant="primary"
            className="btn-hover-shadow"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Create New Group
          </Button>
        </div>
      )}

      <Card className="mb-4 shadow-sm">
        <Card.Body>
          <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
            <h2 className="fs-4 fw-semibold text-primary mb-3 mb-md-0">
              Filter Study Groups
            </h2>
            <div className="d-flex flex-wrap gap-2">
              <ButtonGroup>
                <Button
                  variant={
                    selectedCategory === "All" ? "primary" : "outline-primary"
                  }
                  onClick={() => setSelectedCategory("All")}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category
                        ? "primary"
                        : "outline-primary"
                    }
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>
        </Card.Body>
      </Card>

      {isLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-secondary">Loading study groups...</p>
        </div>
      ) : filteredGroups.length === 0 ? (
        <Alert variant="info">
          <i className="fas fa-info-circle me-2"></i>
          No study groups found. {user && "Create one to get started!"}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {filteredGroups.map((group, index) => (
            <Col key={group._id}>
              <GroupCard
                group={group}
                user={user}
                visibleMembers={visibleMembers}
                toggleMembersVisibility={toggleMembersVisibility}
                handleEditGroup={handleEditGroup}
                handleDeleteConfirmation={handleDeleteConfirmation}
                handleJoinGroup={handleJoinGroup}
                handleLeaveGroup={handleLeaveGroup}
                deleteConfirmation={deleteConfirmation}
                handleDeleteGroup={handleDeleteGroup}
                cancelDeleteGroup={cancelDeleteGroup}
                animationDelay={`${index * 0.1}s`}
              />
            </Col>
          ))}
        </Row>
      )}

      {/* Create Group Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create Study Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <GroupForm
            group={newGroup}
            setGroup={setNewGroup}
            categories={categories}
            groupIcons={groupIcons}
            handleSubmit={handleCreateGroup}
            handleCancel={() => setShowCreateModal(false)}
            isLoading={isLoading}
            buttonText="Create Group"
          />
        </Modal.Body>
      </Modal>

      {/* Edit Group Modal */}
      <Modal show={!!editGroup} onHide={cancelEditGroup} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Study Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editGroup && (
            <GroupForm
              group={editGroup}
              setGroup={setEditGroup}
              categories={categories}
              groupIcons={groupIcons}
              handleSubmit={handleUpdateGroup}
              handleCancel={cancelEditGroup}
              isLoading={isLoading}
              buttonText="Update Group"
              ref={editFormRef}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default StudyGroups;
