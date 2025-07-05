import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Badge, Spinner, Alert } from "react-bootstrap";

function ProfileGroups({
  groups,
  isLoading,
  setTemporaryMessage,
  setTemporarySuccess,
}) {
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading groups...</p>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <Alert variant="info" className="mt-3">
        <div className="d-flex align-items-center">
          <i className="fas fa-info-circle me-3 fs-5"></i>
          <div>
            <p className="mb-2">You haven't joined any study groups yet.</p>
            <div>
              <Button as={Link} to="/study-groups" variant="primary" size="sm">
                Browse Groups
              </Button>
            </div>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <div className="mt-3">
      <Row xs={1} md={2} className="g-4">
        {groups.map((group, index) => (
          <Col key={group._id}>
            <Card
              className="h-100 shadow-sm animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Card.Body className="d-flex flex-column">
                <div className="d-flex align-items-center mb-3">
                  <div
                    className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center me-3"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <i
                      className={`fa-solid ${group.groupImage || "fa-users"}`}
                    ></i>
                  </div>
                  <div>
                    <Card.Title className="mb-0 fs-5">{group.name}</Card.Title>
                    {group.category && (
                      <Badge bg="primary" pill className="mt-1">
                        {group.category}
                      </Badge>
                    )}
                  </div>
                </div>

                <Card.Text className="text-secondary mb-3">
                  {group.description.length > 100
                    ? `${group.description.substring(0, 100)}...`
                    : group.description}
                </Card.Text>

                <div className="d-flex justify-content-between align-items-center mt-auto">
                  <small className="text-muted">
                    <i className="fas fa-users me-1"></i>{" "}
                    {group.members?.length || 0} members
                  </small>

                  <Button
                    as={Link}
                    to={`/groups/${group._id}`}
                    variant="outline-primary"
                    size="sm"
                  >
                    View Group
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default ProfileGroups;
