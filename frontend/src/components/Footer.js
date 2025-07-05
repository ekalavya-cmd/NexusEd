import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Footer() {
  const { user } = useContext(AuthContext);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="bg-gradient-primary text-white mt-auto">
        <div className="footer-main py-5">
          <div className="container">
            <Row className="g-4">
              {/* Brand Section */}
              <Col lg={4} md={6}>
                <div className="footer-section">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-graduation-cap me-2 fs-2"></i>
                    <h5 className="mb-0 fw-bold">NexusEd</h5>
                  </div>
                  <p className="text-white-50 mb-3">
                    Empowering students through collaborative learning, resource
                    sharing, and community building. Join thousands of students
                    already learning together.
                  </p>
                  <div className="social-links">
                    <h6 className="mb-2">Connect With Us</h6>
                    <div className="d-flex gap-2">
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="social-btn"
                        href="https://github.com/nexused"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-github"></i>
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="social-btn"
                        href="https://twitter.com/nexused"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-twitter"></i>
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="social-btn"
                        href="https://linkedin.com/company/nexused"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className="fab fa-linkedin"></i>
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="social-btn"
                        href="mailto:support@nexused.com"
                      >
                        <i className="fas fa-envelope"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>

              {/* Quick Links */}
              <Col lg={2} md={6}>
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Quick Links</h6>
                  <ul className="list-unstyled footer-links">
                    <li>
                      <Link
                        to="/"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/study-groups"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        Study Groups
                      </Link>
                    </li>
                    {user && (
                      <>
                        <li>
                          <Link
                            to="/calendar"
                            className="text-white-50 text-decoration-none hover-link"
                          >
                            Calendar
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/profile"
                            className="text-white-50 text-decoration-none hover-link"
                          >
                            Profile
                          </Link>
                        </li>
                      </>
                    )}
                    {!user && (
                      <>
                        <li>
                          <Link
                            to="/login"
                            className="text-white-50 text-decoration-none hover-link"
                          >
                            Login
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/register"
                            className="text-white-50 text-decoration-none hover-link"
                          >
                            Register
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </Col>

              {/* Features */}
              <Col lg={3} md={6}>
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Features</h6>
                  <ul className="list-unstyled footer-features">
                    <li className="mb-2">
                      <i className="fas fa-users text-white-50 me-2"></i>
                      <span className="text-white-50">Study Groups</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-calendar-alt text-white-50 me-2"></i>
                      <span className="text-white-50">Event Calendar</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-comments text-white-50 me-2"></i>
                      <span className="text-white-50">Group Chat</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-share-alt text-white-50 me-2"></i>
                      <span className="text-white-50">Resource Sharing</span>
                    </li>
                    <li className="mb-2">
                      <i className="fas fa-moon text-white-50 me-2"></i>
                      <span className="text-white-50">Dark Mode</span>
                    </li>
                  </ul>
                </div>
              </Col>

              {/* Support & Info */}
              <Col lg={3} md={6}>
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Support & Info</h6>
                  <ul className="list-unstyled footer-links">
                    <li>
                      <button
                        className="btn btn-link text-white-50 p-0 text-decoration-none hover-link"
                        onClick={() => setShowAbout(true)}
                      >
                        About NexusEd
                      </button>
                    </li>
                    <li>
                      <a
                        href="mailto:support@nexused.com"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        Contact Support
                      </a>
                    </li>
                    <li>
                      <button
                        className="btn btn-link text-white-50 p-0 text-decoration-none hover-link"
                        onClick={() => setShowPrivacy(true)}
                      >
                        Privacy Policy
                      </button>
                    </li>
                    <li>
                      <button
                        className="btn btn-link text-white-50 p-0 text-decoration-none hover-link"
                        onClick={() => setShowTerms(true)}
                      >
                        Terms of Service
                      </button>
                    </li>
                    <li>
                      <a
                        href="https://github.com/nexused/nexused/issues"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        Report Issue
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom border-top border-white-50 py-3">
          <div className="container">
            <Row className="align-items-center">
              <Col md={6}>
                <p className="mb-0 text-white-50 small">
                  © {currentYear} NexusEd. All rights reserved.
                  <span className="ms-2">Built with ❤️ for students</span>
                </p>
              </Col>
              <Col md={6} className="text-md-end">
                <div className="d-flex justify-content-md-end justify-content-start align-items-center gap-3">
                  <span className="text-white-50 small">
                    <i className="fas fa-code me-1"></i>
                    Version 1.0.0
                  </span>
                  <Button
                    variant="outline-light"
                    size="sm"
                    onClick={scrollToTop}
                    className="back-to-top-btn"
                    title="Back to top"
                  >
                    <i className="fas fa-arrow-up"></i>
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <Modal
        show={showAbout}
        onHide={() => setShowAbout(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-graduation-cap text-primary me-2"></i>
            About NexusEd
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <i
              className="fas fa-graduation-cap text-primary mb-3"
              style={{ fontSize: "3rem" }}
            ></i>
            <h4>Connecting Students, Enabling Success</h4>
          </div>
          <p>
            NexusEd is a comprehensive student collaboration platform designed
            to bridge the gap between individual learning and collective
            knowledge sharing. Our mission is to create a vibrant community
            where students can connect, collaborate, and achieve academic
            success together.
          </p>
          <Row className="g-3 mt-3">
            <Col md={6}>
              <div className="feature-highlight p-3 bg-light rounded">
                <i className="fas fa-users text-primary me-2"></i>
                <strong>Study Groups</strong>
                <p className="mb-0 small text-muted">
                  Join or create study groups based on your interests and
                  subjects.
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className="feature-highlight p-3 bg-light rounded">
                <i className="fas fa-calendar text-primary me-2"></i>
                <strong>Event Management</strong>
                <p className="mb-0 small text-muted">
                  Schedule and manage study sessions, meetings, and events.
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className="feature-highlight p-3 bg-light rounded">
                <i className="fas fa-share-alt text-primary me-2"></i>
                <strong>Resource Sharing</strong>
                <p className="mb-0 small text-muted">
                  Share notes, documents, and study materials with your peers.
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className="feature-highlight p-3 bg-light rounded">
                <i className="fas fa-comments text-primary me-2"></i>
                <strong>Real-time Chat</strong>
                <p className="mb-0 small text-muted">
                  Communicate instantly with group members through integrated
                  chat.
                </p>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>

      {/* Privacy Policy Modal */}
      <Modal
        show={showPrivacy}
        onHide={() => setShowPrivacy(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-shield-alt text-primary me-2"></i>
            Privacy Policy
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div className="privacy-content">
            <p>
              <strong>Last updated: January 2025</strong>
            </p>

            <h6>Information We Collect</h6>
            <p>
              We collect information you provide directly to us, such as when
              you create an account, join study groups, or contact us for
              support. This may include your name, email address, profile
              information, and content you post.
            </p>

            <h6>How We Use Your Information</h6>
            <ul>
              <li>To provide and maintain our service</li>
              <li>To facilitate study group interactions</li>
              <li>To send you important updates and notifications</li>
              <li>To improve our platform and user experience</li>
            </ul>

            <h6>Information Sharing</h6>
            <p>
              We do not sell, trade, or otherwise transfer your personal
              information to third parties. Information shared within study
              groups is visible to other group members as part of the
              collaborative learning experience.
            </p>

            <h6>Data Security</h6>
            <p>
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction.
            </p>

            <h6>Contact Us</h6>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at
              <a href="mailto:privacy@nexused.com" className="text-primary">
                {" "}
                privacy@nexused.com
              </a>
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Terms of Service Modal */}
      <Modal
        show={showTerms}
        onHide={() => setShowTerms(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-file-contract text-primary me-2"></i>
            Terms of Service
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "60vh", overflowY: "auto" }}>
          <div className="terms-content">
            <p>
              <strong>Last updated: January 2025</strong>
            </p>

            <h6>Acceptance of Terms</h6>
            <p>
              By accessing and using NexusEd, you accept and agree to be bound
              by the terms and provision of this agreement.
            </p>

            <h6>Use License</h6>
            <p>
              Permission is granted to temporarily use NexusEd for personal,
              non-commercial educational purposes. This is the grant of a
              license, not a transfer of title.
            </p>

            <h6>User Conduct</h6>
            <ul>
              <li>Use the platform respectfully and constructively</li>
              <li>Do not share inappropriate or harmful content</li>
              <li>Respect other users' privacy and intellectual property</li>
              <li>Do not attempt to disrupt or harm the platform</li>
            </ul>

            <h6>Content Guidelines</h6>
            <p>
              Users are responsible for the content they post. We reserve the
              right to remove content that violates our community guidelines or
              terms of service.
            </p>

            <h6>Account Termination</h6>
            <p>
              We may terminate or suspend your account if you violate these
              terms or engage in behavior that harms the community.
            </p>

            <h6>Contact Information</h6>
            <p>
              Questions about the Terms of Service should be sent to us at
              <a href="mailto:legal@nexused.com" className="text-primary">
                {" "}
                legal@nexused.com
              </a>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default Footer;
