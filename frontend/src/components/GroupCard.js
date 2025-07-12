import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { Card, Badge, Button, Alert } from "react-bootstrap";

function GroupCard({
  group,
  user,
  visibleMembers,
  toggleMembersVisibility,
  handleEditGroup,
  handleDeleteConfirmation,
  handleJoinGroup,
  handleLeaveGroup,
  deleteConfirmation,
  handleDeleteGroup,
  cancelDeleteGroup,
  animationDelay,
}) {
  const toggleButtonRef = useRef(null);
  const joinButtonRef = useRef(null);
  const leaveButtonRef = useRef(null);

  const handleToggleMembers = () => {
    toggleMembersVisibility(group._id);
    if (visibleMembers[group._id] && toggleButtonRef.current) {
      toggleButtonRef.current.blur();
    }
  };

  const handleJoinClick = () => {
    handleJoinGroup(group._id);
    if (joinButtonRef.current) {
      joinButtonRef.current.blur();
    }
  };

  const handleLeaveClick = () => {
    handleLeaveGroup(group._id);
    if (leaveButtonRef.current) {
      leaveButtonRef.current.blur();
    }
  };

  // Get icon color based on category
  const getCategoryColor = (category) => {
    switch (category) {
      case "Mathematics":
        return "#0d6efd"; // Primary blue
      case "Programming":
        return "#6610f2"; // Purple
      case "Literature":
        return "#6f42c1"; // Indigo
      case "Science":
        return "#20c997"; // Teal
      case "History":
        return "#fd7e14"; // Orange
      default:
        return "#0d6efd"; // Default blue
    }
  };

  // Format date to show "X days/months ago" or specific date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 1) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <Card
      className="group-card h-100 shadow-hover animate-fade-in-up"
      style={{ animationDelay }}
    >
      <div
        className="group-card-header"
        style={{ backgroundColor: getCategoryColor(group.category) + "15" }}
      >
        <Link
          to={`/groups/${group._id}`}
          className="text-decoration-none stretched-link-wrapper"
        >
          <div className="d-flex align-items-center">
            <div
              className="group-icon-container"
              style={{ backgroundColor: getCategoryColor(group.category) }}
            >
              <i className={`fa-solid ${group.groupImage || "fa-users"}`}></i>
            </div>
            <div className="ms-3 flex-grow-1">
              <h5 className="group-title">{group.name}</h5>
              <div className="d-flex align-items-center">
                <Badge
                  className="category-badge"
                  style={{
                    backgroundColor: getCategoryColor(group.category),
                    color: "white",
                  }}
                >
                  {group.category}
                </Badge>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <Card.Body className="group-card-body">
        <p className="group-description">{group.description}</p>

        <div className="group-stats">
          <div className="stat-item">
            <i className="fas fa-users"></i>
            <span>{group.members?.length || 0} members</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-calendar-alt"></i>
            <span>{group.events?.length || 0} events</span>
          </div>
          <div className="stat-item">
            <i className="fas fa-clock"></i>
            <span>{formatDate(group.createdAt)}</span>
          </div>
        </div>

        {group.members && group.members.length > 0 && (
          <div className="members-section">
            <Button
              variant="link"
              className="members-toggle"
              ref={toggleButtonRef}
              onClick={handleToggleMembers}
            >
              <i
                className={`fas fa-chevron-${
                  visibleMembers[group._id] ? "up" : "down"
                } me-1`}
              ></i>
              {visibleMembers[group._id] ? "Hide" : "Show"} Members
            </Button>

            {visibleMembers[group._id] && (
              <div className="members-list">
                {group.members.map((member) => (
                  <div
                    key={member._id}
                    className="member-avatar"
                    title={member.username || "Unknown"}
                  >
                    <div className="avatar-circle">
                      {member.username
                        ? member.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="member-tooltip">
                      {member.username || "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="group-actions">
            {group.members?.some((member) => member._id === user.id) ? (
              group.creator._id === user.id ? (
                <div className="owner-actions">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="action-btn edit-btn"
                    onClick={() => handleEditGroup(group)}
                  >
                    <i className="fa-solid fa-edit"></i>
                    <span>Edit</span>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteConfirmation(group._id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                    <span>Delete</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="action-btn leave-btn"
                  onClick={handleLeaveClick}
                  ref={leaveButtonRef}
                >
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>Leave Group</span>
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="action-btn join-btn"
                onClick={handleJoinClick}
                ref={joinButtonRef}
              >
                <i className="fa-solid fa-right-to-bracket"></i>
                <span>Join Group</span>
              </Button>
            )}
          </div>
        )}

        {deleteConfirmation === group._id && (
          <Alert
            variant="warning"
            className="delete-confirmation animate-fade-in-up"
          >
            <p className="mb-2">
              Are you sure you want to delete "{group.name}"?
            </p>
            <p className="mb-3 text-danger">
              <small>This action cannot be undone.</small>
            </p>
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={cancelDeleteGroup}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDeleteGroup(group._id)}
              >
                Delete
              </Button>
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default GroupCard;
