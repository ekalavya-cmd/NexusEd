import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";

function ProfileGroups({
  groups,
  isLoading,
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
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="fas fa-users display-1 text-muted"></i>
        </div>
        <h4 className="mb-3">No Study Groups Yet</h4>
        <p className="text-muted mb-4">
          Join study groups to collaborate with other students and enhance your learning experience.
        </p>
        <Button 
          as={Link} 
          to="/study-groups" 
          variant="primary"
          className="btn-hover-shadow"
        >
          <i className="fas fa-search me-2"></i>
          Browse Groups
        </Button>
      </div>
    );
  }

  return (
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
                  className="btn-hover-shadow"
                >
                  View Group
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default ProfileGroups;
