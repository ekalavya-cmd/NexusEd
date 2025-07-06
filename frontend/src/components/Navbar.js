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

  // Enhanced theme switching with detailed logging and performance tracking
  useEffect(() => {
    const startTime = performance.now();
    const theme = darkMode ? "dark" : "light";

    // Apply theme to DOM
    document.documentElement.setAttribute("data-bs-theme", theme);

    // Store preference
    localStorage.setItem("darkMode", darkMode.toString());

    // Update debug attribute in development
    if (process.env.NODE_ENV === "development") {
      document.documentElement.setAttribute("data-theme-debug", theme);
    }

    // Enhanced logging with component detection and performance metrics
    const componentsWithTheme = document.querySelectorAll(
      '[class*="nexus-"], .card, .btn, .form-control, .navbar-custom, footer'
    );

    const primaryColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--nexus-primary");

    const endTime = performance.now();
    const switchDuration = endTime - startTime;

    console.log(`🎨 Theme Switch Summary:
    - New Theme: ${theme}
    - Components Updated: ${componentsWithTheme.length}
    - Switch Duration: ${switchDuration.toFixed(2)}ms
    - Primary Color: ${primaryColor.trim()}
    - Timestamp: ${new Date().toLocaleTimeString()}
    - CSS Variables Active: ${primaryColor ? "✅" : "❌"}
    - Performance: ${
      switchDuration < 50
        ? "Excellent"
        : switchDuration < 100
        ? "Good"
        : "Needs Optimization"
    }`);

    // Log theme change to file in development
    if (process.env.NODE_ENV === "development") {
      logThemeChange(theme, switchDuration);
    }

    // Validate theme consistency after switch (development only)
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        const { validateThemeConsistency } = require("../utils/themeValidator");
        validateThemeConsistency();
      }, 100);
    }
  }, [darkMode]);

  // Enhanced theme change logging
  const logThemeChange = (theme, duration) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      theme: theme,
      duration: `${duration.toFixed(2)}ms`,
      userAgent: navigator.userAgent,
      url: window.location.pathname,
    };

    // Log to console (visible in VS Code terminal)
    console.log(
      `[${logEntry.timestamp}] Theme changed to: ${theme} (${logEntry.duration})`
    );

    // In a real app, you might send this to a logging service
    // For now, we'll store it in sessionStorage for debugging
    const logs = JSON.parse(sessionStorage.getItem("themeLogs") || "[]");
    logs.push(logEntry);
    sessionStorage.setItem("themeLogs", JSON.stringify(logs.slice(-50))); // Keep last 50 logs
  };

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
      "position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50";
    backdrop.style.zIndex = "9998";

    document.body.appendChild(backdrop);
    document.body.appendChild(logoutMessage);

    // Wait for animation, then logout
    setTimeout(async () => {
      try {
        await logout();
        navigate("/");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        // Clean up
        document.body.removeChild(backdrop);
        document.body.removeChild(logoutMessage);
        setIsLoggingOut(false);

        // Restore main content opacity
        if (mainContent) {
          mainContent.style.opacity = "1";
          mainContent.style.transform = "translateY(0)";
        }
        if (footer) {
          footer.style.opacity = "1";
        }
      }
    }, 2000);
  };

  return (
    <>
      <BsNavbar
        expand="lg"
        className="navbar-custom sticky-top"
        expanded={expanded}
      >
        <Container>
          {/* Brand */}
          <Link to="/" className="brand-logo">
            <div className="d-flex align-items-center">
              <div className="logo-container me-3">
                <i className="fas fa-graduation-cap logo-icon"></i>
              </div>
              <span className="brand-text">NexusEd</span>
            </div>
          </Link>

          {/* Mobile toggle */}
          <BsNavbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setExpanded(!expanded)}
            className="border-0"
            style={{ boxShadow: "none" }}
          >
            <span className="navbar-toggler-icon"></span>
          </BsNavbar.Toggle>

          <BsNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <RouterNavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link nav-link-custom ${isActive ? "active" : ""}`
                }
              >
                <i className="fas fa-home me-1"></i>
                Home
              </RouterNavLink>

              <RouterNavLink
                to="/study-groups"
                className={({ isActive }) =>
                  `nav-link nav-link-custom ${isActive ? "active" : ""}`
                }
              >
                <i className="fas fa-users me-1"></i>
                Study Groups
              </RouterNavLink>

              {user && (
                <RouterNavLink
                  to="/calendar"
                  className={({ isActive }) =>
                    `nav-link nav-link-custom ${isActive ? "active" : ""}`
                  }
                >
                  <i className="fas fa-calendar-alt me-1"></i>
                  Calendar
                </RouterNavLink>
              )}
            </Nav>

            {/* Right side navigation */}
            <Nav className="ms-auto d-flex align-items-center">
              {/* Search Button */}
              <Button
                variant="outline-light"
                size="sm"
                className="me-2"
                onClick={() => setShowSearch(true)}
              >
                <i className="fas fa-search"></i>
              </Button>

              {/* Theme Toggle */}
              <Button
                variant="outline-light"
                size="sm"
                className="me-2"
                onClick={toggleDarkMode}
                title={`Switch to ${darkMode ? "light" : "dark"} mode`}
              >
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              </Button>

              {user ? (
                <>
                  {/* Notifications */}
                  <Dropdown className="me-2">
                    <Dropdown.Toggle
                      variant="outline-light"
                      size="sm"
                      className="position-relative"
                    >
                      <i className="fas fa-bell"></i>
                      {unreadCount > 0 && (
                        <Badge
                          bg="danger"
                          className="position-absolute top-0 start-100 translate-middle"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {unreadCount}
                        </Badge>
                      )}
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end" style={{ minWidth: "300px" }}>
                      <Dropdown.Header>Notifications</Dropdown.Header>
                      {notifications.map((notification) => (
                        <Dropdown.Item
                          key={notification.id}
                          className={`${
                            notification.unread ? "bg-light" : ""
                          } border-bottom`}
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                        >
                          <div className="d-flex">
                            <div className="flex-grow-1">
                              <small className="text-muted">
                                {notification.text}
                              </small>
                              <br />
                              <small className="text-muted">
                                {notification.time}
                              </small>
                            </div>
                            {notification.unread && (
                              <div className="text-primary">
                                <i
                                  className="fas fa-circle"
                                  style={{ fontSize: "0.5rem" }}
                                ></i>
                              </div>
                            )}
                          </div>
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* User Profile Dropdown */}
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="outline-light"
                      size="sm"
                      className="d-flex align-items-center"
                    >
                      <i className="fas fa-user me-1"></i>
                      {user.username}
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                      <Link to="/profile" className="dropdown-item">
                        <i className="fas fa-user-circle me-2"></i>
                        Profile
                      </Link>
                      <Dropdown.Divider />
                      <Dropdown.Item
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="logout-btn"
                      >
                        {isLoggingOut ? (
                          <>
                            <div
                              className="spinner-border spinner-border-sm me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
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
                </>
              ) : (
                <div className="d-flex">
                  <Link
                    to="/login"
                    className="btn btn-outline-light btn-sm me-2"
                  >
                    Login
                  </Link>
                  <Link to="/register" className="btn btn-light btn-sm">
                    Register
                  </Link>
                </div>
              )}
            </Nav>
          </BsNavbar.Collapse>
        </Container>
      </BsNavbar>

      {/* Search Offcanvas */}
      <Offcanvas
        show={showSearch}
        onHide={() => setShowSearch(false)}
        placement="top"
        className="search-offcanvas"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Search NexusEd</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form onSubmit={handleSearch}>
            <InputGroup size="lg">
              <Form.Control
                type="text"
                placeholder="Search for study groups, posts, or users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button variant="primary" type="submit">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Navbar;
