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

  return (
    <Card
      className="h-100 shadow-sm animate-fade-in-up"
      style={{ animationDelay }}
    >
      <Card.Body>
        <div className="d-flex align-items-center mb-3">
          <div
            className="bg-gradient-primary rounded-circle text-white d-flex align-items-center justify-content-center"
            style={{ width: "48px", height: "48px" }}
          >
            <i
              className={`fa-solid ${group.groupImage || "fa-users"} fs-4`}
            ></i>
          </div>
          <div className="ms-3 flex-grow-1">
            <div className="d-flex justify-content-between align-items-center">
              <Link
                to={`/groups/${group._id}`}
                className="text-decoration-none"
              >
                <h5 className="card-title fw-bold mb-0">{group.name}</h5>
              </Link>
              {group.category && (
                <Badge bg="primary" pill className="ms-2">
                  {group.category}
                </Badge>
              )}
            </div>
            <p className="card-text text-muted mb-2 fst-italic">
              {group.description}
            </p>
          </div>
        </div>

        <div className="d-flex flex-wrap mb-3">
          <small className="me-3 text-muted">
            <i className="fas fa-users me-1"></i> {group.members?.length || 0}{" "}
            members
          </small>
          <small className="me-3 text-muted">
            <i className="fas fa-calendar-alt me-1"></i>{" "}
            {group.events?.length || 0} events
          </small>
          <small className="text-muted">
            <i className="fas fa-clock me-1"></i> Created{" "}
            {new Date(group.createdAt).toLocaleDateString()}
          </small>
        </div>

        {group.members && group.members.length > 0 && (
          <div className="mb-3">
            <Button
              variant="outline-secondary"
              size="sm"
              className="mb-2"
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
              <div className="d-flex flex-wrap mt-2">
                {group.members.map((member) => (
                  <div key={member._id} className="tooltip-container me-2 mb-2">
                    <div
                      className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                      style={{
                        width: "30px",
                        height: "30px",
                        fontSize: "12px",
                      }}
                    >
                      {member.username
                        ? member.username.charAt(0).toUpperCase()
                        : "U"}
                    </div>
                    <span className="tooltip">
                      {member.username || "Unknown"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {user && (
          <div className="d-flex mt-2">
            {group.members?.some((member) => member._id === user.id) ? (
              group.creator._id === user.id ? (
                <>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEditGroup(group)}
                  >
                    <i className="fa-solid fa-edit me-1"></i>
                    Edit Group
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteConfirmation(group._id)}
                  >
                    <i className="fa-solid fa-trash me-1"></i>
                    Delete Group
                  </Button>
                </>
              ) : (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleLeaveClick}
                  ref={leaveButtonRef}
                >
                  <i className="fa-solid fa-right-from-bracket me-1"></i>
                  Leave Group
                </Button>
              )
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleJoinClick}
                ref={joinButtonRef}
              >
                <i className="fa-solid fa-right-to-bracket me-1"></i>
                Join Group
              </Button>
            )}
          </div>
        )}

        {deleteConfirmation === group._id && (
          <Alert variant="warning" className="mt-3 animate-fade-in-up">
            <div className="d-flex justify-content-between align-items-center">
              <span>
                Are you sure you want to delete "{group.name}"? This action
                cannot be undone.
              </span>
              <div>
                <Button
                  variant="danger"
                  size="sm"
                  className="me-2"
                  onClick={() => handleDeleteGroup(group._id)}
                >
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={cancelDeleteGroup}
                >
                  No
                </Button>
              </div>
            </div>
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default GroupCard;
