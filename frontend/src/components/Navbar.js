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
  Dropdown,
  Badge,
} from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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

  // Initialize darkMode from localStorage
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

  // Theme switching with performance tracking
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

    const endTime = performance.now();
    const switchDuration = endTime - startTime;

    // Log theme change to file in development
    if (process.env.NODE_ENV === "development") {
      logThemeChange(theme, switchDuration);

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

    console.log(
      `[${logEntry.timestamp}] Theme changed to: ${theme} (${logEntry.duration})`
    );

    // Store logs in sessionStorage for debugging
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

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        notif.id === id ? { ...notif, unread: false } : notif
      )
    );
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Add a delay to show the logout animation
      setTimeout(() => {
        navigate("/login");
        // Reset state after successful logout
        setIsLoggingOut(false);
      }, 1000);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Custom dropdown toggle components to fix positioning issues
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="notification-btn position-relative"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </button>
  ));

  const UserToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      className="dropdown-toggle"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
    </div>
  ));

  return (
    <BsNavbar
      expand="lg"
      className="navbar-custom sticky-top"
      expanded={expanded}
    >
      <Container>
        {/* Brand */}
        <Link to="/" className="brand-logo">
          <div className="logo-container">
            <i className="fas fa-graduation-cap logo-icon"></i>
          </div>
          <span className="brand-text">NexusEd</span>
        </Link>

        {/* Mobile toggle */}
        <BsNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
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
              <i className="fas fa-home"></i>
              Home
            </RouterNavLink>

            <RouterNavLink
              to="/study-groups"
              className={({ isActive }) =>
                `nav-link nav-link-custom ${isActive ? "active" : ""}`
              }
            >
              <i className="fas fa-users"></i>
              Study Groups
            </RouterNavLink>

            {user && (
              <RouterNavLink
                to="/calendar"
                className={({ isActive }) =>
                  `nav-link nav-link-custom ${isActive ? "active" : ""}`
                }
              >
                <i className="fas fa-calendar-alt"></i>
                Calendar
              </RouterNavLink>
            )}
          </Nav>

          {/* Right side navigation */}
          <Nav className="ms-auto d-flex align-items-center">
            {/* Theme Toggle */}
            <button
              className="theme-toggle-btn"
              onClick={toggleDarkMode}
              title={`Switch to ${darkMode ? "light" : "dark"} mode`}
            >
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            {user ? (
              <>
                {/* Notifications - Using custom toggle */}
                <Dropdown align="end">
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-notifications"
                  >
                    <i className="fas fa-bell"></i>
                    {unreadCount > 0 && (
                      <Badge bg="danger" pill className="notification-badge">
                        {unreadCount}
                      </Badge>
                    )}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Header>Notifications</Dropdown.Header>
                    {notifications.length === 0 ? (
                      <Dropdown.Item disabled>
                        No notifications yet
                      </Dropdown.Item>
                    ) : (
                      notifications.map((notification) => (
                        <Dropdown.Item
                          key={notification.id}
                          onClick={() =>
                            markNotificationAsRead(notification.id)
                          }
                          className={`notification-item ${
                            notification.unread ? "unread" : ""
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              {notification.unread && (
                                <Badge bg="primary" className="me-2" pill>
                                  New
                                </Badge>
                              )}
                              {notification.text}
                            </div>
                          </div>
                          <small className="text-muted d-block mt-1">
                            {notification.time}
                          </small>
                        </Dropdown.Item>
                      ))
                    )}
                    <Dropdown.Divider />
                    <Dropdown.Item className="text-center">
                      <small>See all notifications</small>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* User Dropdown - Using custom toggle */}
                <Dropdown align="end" className="user-dropdown">
                  <Dropdown.Toggle as={UserToggle} id="dropdown-user">
                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        width="24"
                        height="24"
                        className="rounded-circle"
                      />
                    ) : (
                      <i className="fas fa-user-circle"></i>
                    )}
                    <span>{user.username || user.email.split("@")[0]}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item as={Link} to="/profile">
                      <i className="fas fa-user"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/settings">
                      <i className="fas fa-cog"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      className={`logout-btn ${
                        isLoggingOut ? "logging-out" : ""
                      }`}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <>
                          <div
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Logging out...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-sign-out-alt"></i>
                          Logout
                        </>
                      )}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline-light btn-sm">
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
  );
}

export default Navbar;
