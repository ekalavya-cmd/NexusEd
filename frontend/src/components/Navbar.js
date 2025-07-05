import React, { useState, useContext, useEffect } from "react";
import {
  Link,
  NavLink as RouterNavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  Navbar as BsNavbar,
  Nav,
  Container,
  Button,
  Dropdown,
  Badge,
  Offcanvas,
  Form,
  InputGroup,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "New member joined Study Group 'Advanced Math'",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      text: "Upcoming event: 'Physics Study Session'",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      text: "Your post received 5 new likes",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  // Initialize darkMode from localStorage (theme is already applied by index.html script)
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem("darkMode");
    if (stored !== null) {
      return stored === "true";
    }
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  });

  // Only update localStorage and DOM when darkMode state changes (not on mount)
  useEffect(() => {
    // Apply theme to DOM
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );

    // Store preference
    localStorage.setItem("darkMode", darkMode.toString());

    console.log(`🎨 Theme toggled to: ${darkMode ? "dark" : "light"}`);
  }, [darkMode]);

  // Listen for theme changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "darkMode") {
        const newDarkMode = e.newValue === "true";
        if (newDarkMode !== darkMode) {
          setDarkMode(newDarkMode);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [darkMode]);

  // Close mobile menu when route changes
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log("Searching for:", searchQuery);
      setShowSearch(false);
      setSearchQuery("");
      // Navigate to search results or filter current page
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setExpanded(false);

    // Add fade-out effect to the main content
    const mainContent = document.querySelector("main");
    const footer = document.querySelector("footer");

    if (mainContent) {
      mainContent.style.transition =
        "opacity 0.5s ease-out, transform 0.5s ease-out";
      mainContent.style.opacity = "0";
      mainContent.style.transform = "translateY(-20px)";
    }

    if (footer) {
      footer.style.transition = "opacity 0.5s ease-out";
      footer.style.opacity = "0";
    }

    // Show logout success message
    const logoutMessage = document.createElement("div");
    logoutMessage.innerHTML = `
      <div class="position-fixed top-50 start-50 translate-middle" style="z-index: 9999;">
        <div class="card shadow-lg border-0 logout-message-card" style="min-width: 300px;">
          <div class="card-body text-center py-4">
            <div class="mb-3">
              <i class="fas fa-check-circle text-success" style="font-size: 3rem;"></i>
            </div>
            <h5 class="card-title text-success mb-2">Logged Out Successfully!</h5>
            <p class="card-text text-muted mb-0">Redirecting to homepage...</p>
          </div>
        </div>
      </div>
    `;

    // Add backdrop
    const backdrop = document.createElement("div");
    backdrop.className =
      "position-fixed top-0 start-0 w-100 h-100 logout-backdrop";
    backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    backdrop.style.zIndex = "9998";
    backdrop.style.opacity = "0";
    backdrop.style.transition = "opacity 0.3s ease-in-out";

    document.body.appendChild(backdrop);
    document.body.appendChild(logoutMessage);

    // Fade in the backdrop and message
    setTimeout(() => {
      backdrop.style.opacity = "1";
    }, 100);

    // Animate the message card (no rotation/tilt)
    const messageCard = logoutMessage.querySelector(".card");
    messageCard.style.transform = "scale(0.8) translateY(-10px)";
    messageCard.style.opacity = "0";
    messageCard.style.transition =
      "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    setTimeout(() => {
      messageCard.style.transform = "scale(1) translateY(0)";
      messageCard.style.opacity = "1";
    }, 200);

    // Wait for animation, then logout and navigate
    setTimeout(() => {
      // Perform actual logout
      logout();

      // Fade out message
      messageCard.style.transform = "scale(0.9)";
      messageCard.style.opacity = "0";
      backdrop.style.opacity = "0";

      // Navigate to home and clean up
      setTimeout(() => {
        navigate("/");

        // Clean up elements
        if (document.body.contains(logoutMessage)) {
          document.body.removeChild(logoutMessage);
        }
        if (document.body.contains(backdrop)) {
          document.body.removeChild(backdrop);
        }

        // Reset main content styles
        if (mainContent) {
          mainContent.style.opacity = "1";
          mainContent.style.transform = "translateY(0)";
        }

        if (footer) {
          footer.style.opacity = "1";
        }

        setIsLoggingOut(false);
      }, 300);
    }, 1500); // Show success message for 1.5 seconds
  };

  return (
    <>
      <BsNavbar
        expand="lg"
        className="navbar-custom bg-gradient-primary text-white shadow-lg fixed-top"
        expanded={expanded}
        onToggle={setExpanded}
      >
        <Container>
          <BsNavbar.Brand
            as={Link}
            to="/"
            className="text-white fw-bold d-flex align-items-center brand-logo"
          >
            <div className="logo-container me-2">
              <i className="fas fa-graduation-cap logo-icon"></i>
            </div>
            <span className="brand-text">NexusEd</span>
          </BsNavbar.Brand>

          {/* Mobile controls */}
          <div className="d-flex d-lg-none align-items-center gap-2">
            {user && (
              <Button
                variant="link"
                className="text-white p-2"
                onClick={() => setShowSearch(true)}
                disabled={isLoggingOut}
                title="Search"
              >
                <i className="fas fa-search"></i>
              </Button>
            )}

            <Button
              variant="link"
              className="text-white p-2"
              onClick={toggleDarkMode}
              disabled={isLoggingOut}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </Button>

            <BsNavbar.Toggle
              aria-controls="navbar-nav"
              className="border-0 text-white"
              disabled={isLoggingOut}
            >
              <i className="fas fa-bars"></i>
            </BsNavbar.Toggle>
          </div>

          <BsNavbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
              <Nav.Link
                as={RouterNavLink}
                to="/"
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? "active" : ""} ${
                    isLoggingOut ? "opacity-50" : ""
                  }`
                }
                style={{ pointerEvents: isLoggingOut ? "none" : "auto" }}
              >
                <i className="fas fa-home me-2"></i>
                Home
              </Nav.Link>

              <Nav.Link
                as={RouterNavLink}
                to="/study-groups"
                className={({ isActive }) =>
                  `nav-link-custom ${isActive ? "active" : ""} ${
                    isLoggingOut ? "opacity-50" : ""
                  }`
                }
                style={{ pointerEvents: isLoggingOut ? "none" : "auto" }}
              >
                <i className="fas fa-users me-2"></i>
                Study Groups
              </Nav.Link>

              {user && (
                <>
                  <Nav.Link
                    as={RouterNavLink}
                    to="/calendar"
                    className={({ isActive }) =>
                      `nav-link-custom ${isActive ? "active" : ""} ${
                        isLoggingOut ? "opacity-50" : ""
                      }`
                    }
                    style={{ pointerEvents: isLoggingOut ? "none" : "auto" }}
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    Calendar
                  </Nav.Link>
                </>
              )}
            </Nav>

            <Nav className="ms-auto d-flex align-items-center gap-2">
              {/* Search - Desktop */}
              {user && (
                <div className="d-none d-lg-block">
                  <Form onSubmit={handleSearch} className="search-form">
                    <InputGroup size="sm">
                      <Form.Control
                        type="text"
                        placeholder="Search groups, events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                        disabled={isLoggingOut}
                      />
                      <Button
                        variant="outline-light"
                        type="submit"
                        disabled={isLoggingOut || !searchQuery.trim()}
                        className="search-btn"
                      >
                        <i className="fas fa-search"></i>
                      </Button>
                    </InputGroup>
                  </Form>
                </div>
              )}

              {/* Notifications */}
              {user && (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="link"
                    className="text-white text-decoration-none p-2 position-relative notification-btn"
                    disabled={isLoggingOut}
                    title="Notifications"
                  >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <Badge
                        bg="danger"
                        className="position-absolute top-0 start-100 translate-middle badge-notification"
                      >
                        {unreadCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="notification-menu">
                    <Dropdown.Header>
                      <i className="fas fa-bell me-2"></i>
                      Notifications
                      {unreadCount > 0 && (
                        <Badge bg="primary" className="ms-2">
                          {unreadCount}
                        </Badge>
                      )}
                    </Dropdown.Header>
                    <Dropdown.Divider />

                    {notifications.length > 0 ? (
                      <>
                        {notifications.slice(0, 5).map((notification) => (
                          <Dropdown.Item
                            key={notification.id}
                            className={`notification-item ${
                              notification.unread ? "unread" : ""
                            }`}
                            onClick={() =>
                              markNotificationAsRead(notification.id)
                            }
                          >
                            <div className="d-flex align-items-start">
                              <div className="flex-grow-1">
                                <p className="mb-1 small">
                                  {notification.text}
                                </p>
                                <small className="text-muted">
                                  {notification.time}
                                </small>
                              </div>
                              {notification.unread && (
                                <div className="unread-dot"></div>
                              )}
                            </div>
                          </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item className="text-center text-primary">
                          <small>View All Notifications</small>
                        </Dropdown.Item>
                      </>
                    ) : (
                      <Dropdown.Item disabled>
                        <small className="text-muted">No notifications</small>
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}

              {/* Theme Toggle - Desktop */}
              <Button
                variant="link"
                className="text-white text-decoration-none p-2 d-none d-lg-block theme-toggle"
                onClick={toggleDarkMode}
                disabled={isLoggingOut}
                title={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              </Button>

              {/* User Menu */}
              {user ? (
                <Dropdown align="end">
                  <Dropdown.Toggle
                    variant="outline-light"
                    className="user-menu-toggle d-flex align-items-center"
                    disabled={isLoggingOut}
                  >
                    <div className="user-avatar me-2">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt="Profile"
                          className="avatar-img"
                        />
                      ) : (
                        <i className="fas fa-user"></i>
                      )}
                    </div>
                    <span className="d-none d-md-inline">{user.username}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="user-dropdown-menu">
                    <Dropdown.Header>
                      <div className="d-flex align-items-center">
                        <div className="user-avatar-large me-3">
                          {user.profilePicture ? (
                            <img
                              src={user.profilePicture}
                              alt="Profile"
                              className="avatar-img"
                            />
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </div>
                        <div>
                          <div className="fw-bold">{user.username}</div>
                          <small className="text-muted">{user.email}</small>
                        </div>
                      </div>
                    </Dropdown.Header>
                    <Dropdown.Divider />

                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fas fa-user me-2"></i>
                      My Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/calendar">
                      <i className="fas fa-calendar me-2"></i>
                      My Calendar
                    </Dropdown.Item>
                    <Dropdown.Divider />

                    <Dropdown.Item
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="text-danger"
                    >
                      {isLoggingOut ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Logging out...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </>
                      )}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <div className="d-flex gap-2">
                  <Button
                    as={Link}
                    to="/login"
                    variant="outline-light"
                    size="sm"
                    className="auth-btn"
                  >
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Login
                  </Button>
                  <Button
                    as={Link}
                    to="/register"
                    variant="light"
                    size="sm"
                    className="auth-btn"
                  >
                    <i className="fas fa-user-plus me-2"></i>
                    Register
                  </Button>
                </div>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>

      {/* Mobile Search Offcanvas */}
      <Offcanvas
        show={showSearch}
        onHide={() => setShowSearch(false)}
        placement="top"
        className="search-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <i className="fas fa-search me-2"></i>
            Search NexusEd
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search for study groups, events, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button
                variant="primary"
                type="submit"
                disabled={!searchQuery.trim()}
              >
                <i className="fas fa-search me-2"></i>
                Search
              </Button>
            </InputGroup>
          </Form>

          <div className="search-suggestions">
            <h6 className="text-muted">Popular Searches</h6>
            <div className="d-flex flex-wrap gap-2">
              <Button variant="outline-secondary" size="sm">
                Math Study Group
              </Button>
              <Button variant="outline-secondary" size="sm">
                Physics Events
              </Button>
              <Button variant="outline-secondary" size="sm">
                Computer Science
              </Button>
              <Button variant="outline-secondary" size="sm">
                Study Sessions
              </Button>
            </div>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Navbar;
