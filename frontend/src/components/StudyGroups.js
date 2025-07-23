import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import {
  Row,
  Col,
  Card,
  Button,
  ButtonGroup,
  Spinner,
  Modal,
  InputGroup,
  FormControl,
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
  const [searchTerm, setSearchTerm] = useState("");
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
    }, 1500); // Reduced to 1.5 seconds
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
    if (!user) return;

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

  const handleDeleteConfirmation = (groupId) => {
    setDeleteConfirmation(groupId);
  };

  const handleDeleteGroup = async (groupId) => {
    if (!user) return;

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

  // Filter groups by category and search term
  const filteredGroups = groups
    .filter(
      (group) =>
        selectedCategory === "All" || group.category === selectedCategory
    )
    .filter(
      (group) =>
        searchTerm === "" ||
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (authLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="study-groups-container animate-fade-in-up">
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

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h1 className="study-groups-title mb-3 mb-md-0">Study Groups</h1>

        {user && (
          <Button
            variant="primary"
            className="create-group-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <i className="fas fa-plus me-2"></i>
            Create New Group
          </Button>
        )}
      </div>

      <Card className="shadow mb-4">
        <Card.Body className="p-4">
          <div className="d-flex flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between gap-3">
            <div className="search-container flex-grow-1">
              <InputGroup className="search-input" style={{ maxWidth: "400px" }}>
                <InputGroup.Text className="bg-light border-end-0">
                  <i className="fas fa-search text-muted"></i>
                </InputGroup.Text>
                <FormControl
                  placeholder="Search groups by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search groups"
                  className="border-start-0 ps-0"
                  style={{ boxShadow: "none" }}
                />
                {searchTerm && (
                  <Button
                    variant="outline-secondary"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                    className="border-start-0"
                    style={{ borderColor: "#ced4da" }}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                )}
              </InputGroup>
            </div>
            <div className="filter-buttons">
              <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center gap-2">
                <h6 className="filter-label mb-2 mb-md-0 me-0 me-md-2 text-muted">
                  Filter by:
                </h6>
                <ButtonGroup className="category-filter">
                  <Button
                    variant={
                      selectedCategory === "All" ? "primary" : "outline-primary"
                    }
                    onClick={() => setSelectedCategory("All")}
                    className="category-btn"
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
                      className="category-btn"
                    >
                      {category}
                    </Button>
                  ))}
                </ButtonGroup>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {isLoading ? (
        <div className="loader-container">
          <div className="loader-content">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="loading-text">Loading study groups...</p>
          </div>
        </div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-4">
            <i className="fas fa-users display-1 text-muted"></i>
          </div>
          <h4 className="mb-3">No Study Groups Found</h4>
          <p className="text-muted mb-4">
            {searchTerm
              ? "No results match your search criteria. Try different keywords or clear the search."
              : selectedCategory !== "All"
              ? `No ${selectedCategory} groups available yet.`
              : user
              ? "Create a new study group to get started!"
              : "Join NexusEd to create and participate in study groups."}
          </p>
          {user && (
            <Button
              variant="primary"
              className="btn-hover-shadow"
              onClick={() => setShowCreateModal(true)}
            >
              <i className="fas fa-plus me-2"></i>
              Create New Group
            </Button>
          )}
          {!user && (
            <Button variant="primary" className="btn-hover-shadow" href="/login">
              <i className="fas fa-sign-in-alt me-2"></i>
              Login to Join
            </Button>
          )}
        </div>
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
        className="group-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-plus-circle text-primary me-2"></i>
            Create Study Group
          </Modal.Title>
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
      <Modal
        show={!!editGroup}
        onHide={cancelEditGroup}
        size="lg"
        centered
        className="group-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-edit text-primary me-2"></i>
            Edit Study Group
          </Modal.Title>
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
