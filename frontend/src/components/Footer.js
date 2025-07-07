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

  // ROOT CAUSE FIX: The scroll issue is caused by CSS containment
  // This version forces scroll without containment interference
  const scrollToTop = () => {
    console.log("ScrollToTop function called");

    // Get current scroll position
    const currentScroll =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    console.log("Current scroll position:", currentScroll);

    if (currentScroll === 0) {
      console.log("Already at top of page!");
      return;
    }

    // Method 1: Force immediate scroll first (as fallback)
    try {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log("Immediate scroll executed");
    } catch (error) {
      console.log("Immediate scroll failed:", error);
    }

    // Method 2: Then apply smooth scroll for visual effect
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
      console.log("Smooth scroll initiated");
    } catch (error) {
      console.log("Smooth scroll failed:", error);

      // Method 3: Manual smooth scroll animation
      const smoothScrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
          window.requestAnimationFrame(smoothScrollToTop);
          window.scrollTo(0, c - c / 8);
        }
      };
      smoothScrollToTop();
    }
  };

  return (
    <>
      <footer className="bg-gradient-primary text-white mt-auto">
        <div className="footer-main py-5">
          <div className="container">
            <Row className="g-4">
              {/* Brand Section */}
              <Col lg={3} md={6}>
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
                </div>
              </Col>

              {/* Connect With Us Section (with Social Icons) */}
              <Col lg={3} md={6}>
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Connect With Us</h6>

                  {/* Social Icons */}
                  <div className="social-icons mb-4">
                    <a
                      href="https://facebook.com/nexused"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      title="Follow us on Facebook"
                    >
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a
                      href="https://twitter.com/nexused"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      title="Follow us on Twitter"
                    >
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a
                      href="https://instagram.com/nexused"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      title="Follow us on Instagram"
                    >
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a
                      href="https://linkedin.com/company/nexused"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon"
                      title="Connect with us on LinkedIn"
                    >
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </div>

                  {/* Contact Links */}
                  <ul className="list-unstyled footer-links">
                    <li>
                      <a
                        href="mailto:hello@nexused.com"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        <i className="fas fa-envelope me-2"></i>
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a
                        href="tel:+1234567890"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        <i className="fas fa-phone me-2"></i>
                        Call Support
                      </a>
                    </li>
                  </ul>
                </div>
              </Col>

              {/* Quick Links Section (Navigation Links) */}
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

              {/* Features Section */}
              <Col lg={2} md={6}>
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

              {/* Support & Info Section */}
              <Col lg={2} md={6}>
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
                <div className="d-flex justify-content-md-end justify-content-center align-items-center gap-3">
                  <span className="text-white-50 small">
                    <i className="fas fa-code me-1"></i>
                    Version 1.0.0
                  </span>
                  {/* ROOT CAUSE FIX: Direct button without Bootstrap component wrapper */}
                  <button
                    type="button"
                    className="back-to-top-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("Back to top button clicked directly");
                      scrollToTop();
                    }}
                    title="Back to top"
                    aria-label="Scroll to top of page"
                  >
                    <i className="fas fa-arrow-up" aria-hidden="true"></i>
                  </button>
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
                  Share notes, documents, and learning materials with your
                  peers.
                </p>
              </div>
            </Col>
            <Col md={6}>
              <div className="feature-highlight p-3 bg-light rounded">
                <i className="fas fa-comments text-primary me-2"></i>
                <strong>Real-time Chat</strong>
                <p className="mb-0 small text-muted">
                  Communicate with group members through integrated messaging.
                </p>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAbout(false)}>
            Close
          </Button>
        </Modal.Footer>
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
        <Modal.Body>
          <div className="mb-4">
            <p>
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              At NexusEd, we take your privacy seriously. This Privacy Policy
              explains how we collect, use, and protect your personal
              information when you use our platform.
            </p>
          </div>

          <h5>Information We Collect</h5>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, join study groups, or contact us for support.
            This may include your name, email address, and profile information.
          </p>

          <h5>How We Use Your Information</h5>
          <p>
            We use the information we collect to provide, maintain, and improve
            our services, facilitate study group connections, and communicate
            with you about your account and our services.
          </p>

          <h5>Information Sharing</h5>
          <p>
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this policy or as required by law.
          </p>

          <h5>Data Security</h5>
          <p>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction.
          </p>

          <h5>Contact Us</h5>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at <a href="mailto:privacy@nexused.com">privacy@nexused.com</a>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrivacy(false)}>
            Close
          </Button>
        </Modal.Footer>
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
        <Modal.Body>
          <div className="mb-4">
            <p>
              <strong>Last updated:</strong> {new Date().toLocaleDateString()}
            </p>
            <p>
              Welcome to NexusEd. These Terms of Service govern your use of our
              platform and services.
            </p>
          </div>

          <h5>Acceptance of Terms</h5>
          <p>
            By accessing and using NexusEd, you accept and agree to be bound by
            the terms and provision of this agreement.
          </p>

          <h5>User Responsibilities</h5>
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activities that occur under your
            account. You agree to use the platform in a respectful and lawful
            manner.
          </p>

          <h5>Content Guidelines</h5>
          <p>
            Users must not post content that is offensive, harmful, or violates
            any laws. We reserve the right to remove content that violates these
            guidelines.
          </p>

          <h5>Intellectual Property</h5>
          <p>
            The platform and its original content, features, and functionality
            are owned by NexusEd and are protected by international copyright,
            trademark, and other intellectual property laws.
          </p>

          <h5>Limitation of Liability</h5>
          <p>
            NexusEd shall not be liable for any indirect, incidental, special,
            consequential, or punitive damages resulting from your use of the
            platform.
          </p>

          <h5>Contact Information</h5>
          <p>
            For questions about these Terms of Service, please contact us at{" "}
            <a href="mailto:legal@nexused.com">legal@nexused.com</a>.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTerms(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Footer;
