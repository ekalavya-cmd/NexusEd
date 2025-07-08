import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Footer() {
  const { user } = useContext(AuthContext);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  // New state for feature descriptions
  const [showFeatureDescription, setShowFeatureDescription] = useState(false);
  const [featureDetails, setFeatureDetails] = useState({
    title: "",
    icon: "",
    description: "",
  });

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

  // Function to show feature descriptions
  const handleFeatureClick = (title, icon, description) => {
    setFeatureDetails({
      title,
      icon,
      description,
    });
    setShowFeatureDescription(true);
  };

  return (
    <>
      <footer className="bg-gradient-primary text-white mt-auto">
        <div className="footer-main py-5">
          <div className="container">
            <Row className="g-5">
              {/* NexusEd Section with Connect With Us */}
              <Col lg={3} md={6} className="footer-section-col mb-4 mb-lg-0">
                <div className="footer-section">
                  <div className="d-flex align-items-center mb-3">
                    <i className="fas fa-graduation-cap me-2 fs-2"></i>
                    <h5 className="mb-0 fw-bold">NexusEd</h5>
                  </div>
                  <div className="footer-description mb-3">
                    <p className="text-white-50 mb-2">
                      Empowering students through collaborative learning,
                      resource sharing, and community building.
                    </p>
                    <p className="text-white-50">
                      Join thousands of students already learning together.
                    </p>
                  </div>

                  {/* Connect With Us Section (with Social Icons) - Moved under NexusEd description */}
                  <h6 className="mb-3 fw-bold">Connect With Us</h6>

                  {/* Social Icons - Without rectangular box */}
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
                </div>
              </Col>

              {/* Features Section - With clickable items */}
              <Col lg={3} md={6} className="footer-section-col mb-4 mb-lg-0">
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Features</h6>
                  <ul className="list-unstyled footer-features">
                    <li className="mb-2">
                      <button
                        className="bg-transparent border-0 p-0 d-flex align-items-center"
                        onClick={() =>
                          handleFeatureClick(
                            "Study Groups",
                            "fas fa-users",
                            "Create or join study groups based on your courses, interests, or learning goals. Collaborate with peers, share resources, and organize study sessions to enhance your learning experience."
                          )
                        }
                      >
                        <i className="fas fa-users text-white-50 me-2"></i>
                        <span className="text-white-50">Study Groups</span>
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        className="bg-transparent border-0 p-0 d-flex align-items-center"
                        onClick={() =>
                          handleFeatureClick(
                            "Event Calendar",
                            "fas fa-calendar-alt",
                            "Keep track of all your academic events, study sessions, and group meetings in one place. Create, edit, and manage events with customizable notifications to stay organized throughout your academic journey."
                          )
                        }
                      >
                        <i className="fas fa-calendar-alt text-white-50 me-2"></i>
                        <span className="text-white-50">Event Calendar</span>
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        className="bg-transparent border-0 p-0 d-flex align-items-center"
                        onClick={() =>
                          handleFeatureClick(
                            "Group Chat",
                            "fas fa-comments",
                            "Communicate with your study group members in real-time. Share ideas, ask questions, and collaborate efficiently with integrated messaging that supports text, images, and file sharing."
                          )
                        }
                      >
                        <i className="fas fa-comments text-white-50 me-2"></i>
                        <span className="text-white-50">Group Chat</span>
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        className="bg-transparent border-0 p-0 d-flex align-items-center"
                        onClick={() =>
                          handleFeatureClick(
                            "Resource Sharing",
                            "fas fa-share-alt",
                            "Easily share study materials, lecture notes, practice problems, and helpful resources with your peers. Upload, organize, and access a wide range of educational content to support collaborative learning."
                          )
                        }
                      >
                        <i className="fas fa-share-alt text-white-50 me-2"></i>
                        <span className="text-white-50">Resource Sharing</span>
                      </button>
                    </li>
                    <li className="mb-2">
                      <button
                        className="bg-transparent border-0 p-0 d-flex align-items-center"
                        onClick={() =>
                          handleFeatureClick(
                            "Dark Mode",
                            "fas fa-moon",
                            "Reduce eye strain during late-night study sessions with our customizable dark mode. Toggle between light and dark themes based on your preference for a comfortable viewing experience."
                          )
                        }
                      >
                        <i className="fas fa-moon text-white-50 me-2"></i>
                        <span className="text-white-50">Dark Mode</span>
                      </button>
                    </li>
                  </ul>
                </div>
              </Col>

              {/* Support & Info Section */}
              <Col lg={3} md={6} className="footer-section-col mb-4 mb-lg-0">
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Support & Info</h6>
                  <ul className="list-unstyled footer-links">
                    <li className="mb-3">
                      <button
                        className="text-white-50 text-decoration-none hover-link bg-transparent border-0 p-0"
                        onClick={() => setShowAbout(true)}
                      >
                        <i className="fas fa-info-circle me-2"></i>
                        About Us
                      </button>
                    </li>
                    <li className="mb-3">
                      <button
                        className="text-white-50 text-decoration-none hover-link bg-transparent border-0 p-0"
                        onClick={() => setShowPrivacy(true)}
                      >
                        <i className="fas fa-shield-alt me-2"></i>
                        Privacy Policy
                      </button>
                    </li>
                    <li className="mb-3">
                      <button
                        className="text-white-50 text-decoration-none hover-link bg-transparent border-0 p-0"
                        onClick={() => setShowTerms(true)}
                      >
                        <i className="fas fa-file-contract me-2"></i>
                        Terms of Service
                      </button>
                    </li>
                    <li className="mb-3">
                      <a
                        href="mailto:hello@nexused.com"
                        className="text-white-50 text-decoration-none hover-link"
                      >
                        <i className="fas fa-envelope me-2"></i>
                        Contact Us
                      </a>
                    </li>
                    <li className="mb-3">
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
              <Col lg={3} md={6} className="footer-section-col mb-4 mb-lg-0">
                <div className="footer-section">
                  <h6 className="mb-3 fw-bold">Quick Links</h6>
                  <ul className="list-unstyled footer-links">
                    <li className="mb-3">
                      <Link
                        to="/"
                        className="text-white-50 text-decoration-none hover-link border-0"
                      >
                        Home
                      </Link>
                    </li>
                    <li className="mb-3">
                      <Link
                        to="/study-groups"
                        className="text-white-50 text-decoration-none hover-link border-0"
                      >
                        Study Groups
                      </Link>
                    </li>
                    {user && (
                      <>
                        <li className="mb-3">
                          <Link
                            to="/calendar"
                            className="text-white-50 text-decoration-none hover-link border-0"
                          >
                            Calendar
                          </Link>
                        </li>
                        <li className="mb-3">
                          <Link
                            to="/profile"
                            className="text-white-50 text-decoration-none hover-link border-0"
                          >
                            Profile
                          </Link>
                        </li>
                      </>
                    )}
                    {!user && (
                      <>
                        <li className="mb-3">
                          <Link
                            to="/login"
                            className="text-white-50 text-decoration-none hover-link border-0"
                          >
                            Login
                          </Link>
                        </li>
                        <li className="mb-3">
                          <Link
                            to="/register"
                            className="text-white-50 text-decoration-none hover-link border-0"
                          >
                            Register
                          </Link>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        {/* Footer Bottom with Copyright */}
        <div className="footer-bottom py-3">
          <div className="container">
            <Row className="align-items-center">
              <Col md={6}>
                <p className="mb-md-0 text-white-50 small copyright">
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

      {/* Feature Description Modal */}
      <Modal
        show={showFeatureDescription}
        onHide={() => setShowFeatureDescription(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <i className={`${featureDetails.icon} text-primary me-2`}></i>
            {featureDetails.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{featureDetails.description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowFeatureDescription(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

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
            We collect information that you provide directly to us, such as when
            you create an account, update your profile, participate in community
            features, or contact us for support.
          </p>

          <h5>How We Use Your Information</h5>
          <p>
            We use your information to provide, maintain, and improve our
            services, communicate with you, and personalize your experience on
            the platform.
          </p>

          <h5>Information Sharing</h5>
          <p>
            We do not sell your personal information. We may share information
            with third-party service providers who help us operate our platform,
            but they are obligated to protect your information.
          </p>

          <h5>Data Security</h5>
          <p>
            We implement appropriate security measures to protect your personal
            information from unauthorized access, alteration, or disclosure.
          </p>

          <h5>Your Choices</h5>
          <p>
            You can access, update, or delete your account information at any
            time through your profile settings. You can also opt out of
            promotional communications by following the instructions in the
            messages.
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
              Please read these Terms of Service carefully before using the
              NexusEd platform. These terms govern your access to and use of our
              services.
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
