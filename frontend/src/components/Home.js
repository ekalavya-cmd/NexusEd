import React from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="animate-fade-in-up">
      <Card className="shadow mb-5">
        <Card.Body className="p-4 p-md-5">
          <h1 className="display-5 fw-bold text-primary mb-4">
            Welcome to NexusEd
          </h1>
          <p className="lead text-secondary mb-5">
            A community platform for students to collaborate, share resources,
            and organize study groups.
          </p>
          <Row xs={1} md={3} className="g-4">
            <Col>
              <Card className="h-100 bg-light text-center">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="mb-3">
                    <i className="fas fa-users text-primary fs-1"></i>
                  </div>
                  <Card.Title className="fs-4 fw-semibold mb-3">
                    Join Study Groups
                  </Card.Title>
                  <Card.Text className="text-secondary mb-4 flex-grow-1">
                    Connect with students sharing similar interests and academic
                    goals.
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to="/study-groups"
                      variant="outline-primary"
                      className="btn-hover-shadow"
                    >
                      Explore Groups
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 bg-light text-center">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="mb-3">
                    <i className="fas fa-comments text-primary fs-1"></i>
                  </div>
                  <Card.Title className="fs-4 fw-semibold mb-3">
                    Share Resources
                  </Card.Title>
                  <Card.Text className="text-secondary mb-4 flex-grow-1">
                    Post questions, share study materials, and discuss course
                    topics.
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to="/"
                      variant="outline-primary"
                      className="btn-hover-shadow"
                    >
                      Start Sharing
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card className="h-100 bg-light text-center">
                <Card.Body className="p-4 d-flex flex-column">
                  <div className="mb-3">
                    <i className="fas fa-calendar-alt text-primary fs-1"></i>
                  </div>
                  <Card.Title className="fs-4 fw-semibold mb-3">
                    Schedule Events
                  </Card.Title>
                  <Card.Text className="text-secondary mb-4 flex-grow-1">
                    Create and join study sessions, workshops, and group
                    meetings.
                  </Card.Text>
                  <div className="mt-auto">
                    <Button
                      as={Link}
                      to="/calendar"
                      variant="outline-primary"
                      className="btn-hover-shadow"
                    >
                      View Calendar
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow mb-5 bg-gradient-primary text-white">
        <Card.Body className="p-4 p-md-5">
          <Row className="align-items-center">
            <Col md={8}>
              <h2 className="fs-2 fw-bold mb-3">Ready to get started?</h2>
              <p className="mb-md-0">
                Join our community of students and start collaborating today!
              </p>
            </Col>
            <Col md={4} className="text-md-end">
              <Button
                as={Link}
                to="/register"
                variant="light"
                size="lg"
                className="btn-hover-shadow"
              >
                Sign Up Now
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="shadow">
        <Card.Body className="p-4 p-md-5">
          <h2 className="fs-2 fw-bold text-primary mb-4">How NexusEd Works</h2>
          <Row xs={1} md={2} lg={4} className="g-4">
            <Col>
              <div className="text-center mb-3">
                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-user-plus text-primary fs-2"></i>
                </div>
                <h3 className="fs-5 fw-semibold">1. Create an Account</h3>
                <p className="text-secondary">
                  Sign up with your email and create your student profile.
                </p>
              </div>
            </Col>

            <Col>
              <div className="text-center mb-3">
                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-search text-primary fs-2"></i>
                </div>
                <h3 className="fs-5 fw-semibold">2. Find Study Groups</h3>
                <p className="text-secondary">
                  Browse or search for groups that match your interests.
                </p>
              </div>
            </Col>

            <Col>
              <div className="text-center mb-3">
                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-book text-primary fs-2"></i>
                </div>
                <h3 className="fs-5 fw-semibold">3. Share Knowledge</h3>
                <p className="text-secondary">
                  Post questions, resources, and engage in discussions.
                </p>
              </div>
            </Col>

            <Col>
              <div className="text-center mb-3">
                <div
                  className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: "80px", height: "80px" }}
                >
                  <i className="fas fa-users text-primary fs-2"></i>
                </div>
                <h3 className="fs-5 fw-semibold">4. Collaborate</h3>
                <p className="text-secondary">
                  Schedule events, meet with peers, and learn together.
                </p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Home;
