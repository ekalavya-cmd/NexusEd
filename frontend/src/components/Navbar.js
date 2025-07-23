import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
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
    document.documentElement.setAttribute("data-bs-theme", theme);
    localStorage.setItem("darkMode", darkMode.toString());

    // Performance logging for theme switching
    const endTime = performance.now();
    console.log(`Theme switch took ${endTime - startTime} milliseconds`);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notif) =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
  };

  // FIXED: Improved logout with immediate UI updates
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Start logout process
      await logout();

      // Navigate immediately without delay for better UX
      navigate("/login");

      // Reset state after navigation
      setIsLoggingOut(false);
    } catch (error) {
      console.error("Logout failed:", error);
      setIsLoggingOut(false);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  // IMPROVED Custom dropdown toggle components to prevent overlap
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      className="notification-btn position-relative"
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      style={{
        position: "relative",
        zIndex: 1031,
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
        e.stopPropagation();
        onClick(e);
      }}
      style={{
        position: "relative",
        zIndex: 1031,
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
        <Link to="/" className="brand-logo" onFocus={(e) => e.target.blur()}>
          <div className="logo-container">
            <i className="fas fa-graduation-cap logo-icon"></i>
          </div>
          <span className="brand-text">NexusEd</span>
        </Link>

        {/* Mobile toggle */}
        <BsNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={() => setExpanded(!expanded)}
          onFocus={(e) => e.target.blur()}
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
              onFocus={(e) => e.target.blur()}
            >
              <i className="fas fa-home"></i>
              Home
            </RouterNavLink>

            <RouterNavLink
              to="/study-groups"
              className={({ isActive }) =>
                `nav-link nav-link-custom ${isActive ? "active" : ""}`
              }
              onFocus={(e) => e.target.blur()}
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
                onFocus={(e) => e.target.blur()}
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
              onFocus={(e) => e.target.blur()}
              title={`Switch to ${darkMode ? "light" : "dark"} mode`}
            >
              <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            {user ? (
              <>
                {/* Notifications - Using improved custom toggle with better positioning */}
                <Dropdown align="end" className="position-relative">
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

                  <Dropdown.Menu
                    style={{
                      marginTop: "0.25rem",
                      zIndex: 1055,
                      minWidth: "280px",
                      maxWidth: "350px",
                    }}
                  >
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
                          onFocus={(e) => e.target.blur()}
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
                    <Dropdown.Item
                      className="text-center"
                      onFocus={(e) => e.target.blur()}
                    >
                      <small>See all notifications</small>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                {/* User Dropdown - Using improved custom toggle with better positioning */}
                <Dropdown
                  align="end"
                  className="user-dropdown position-relative"
                >
                  <Dropdown.Toggle as={UserToggle} id="dropdown-user">
                    {user.profilePicture ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}${user.profilePicture}`}
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

                  <Dropdown.Menu
                    style={{
                      marginTop: "0.25rem",
                      zIndex: 1055,
                      minWidth: "200px",
                    }}
                  >
                    <Dropdown.Item
                      as={Link}
                      to="/profile"
                      onFocus={(e) => e.target.blur()}
                    >
                      <i className="fas fa-user"></i>
                      Profile
                    </Dropdown.Item>
                    <Dropdown.Item
                      as={Link}
                      to="/settings"
                      onFocus={(e) => e.target.blur()}
                    >
                      <i className="fas fa-cog"></i>
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      onClick={handleLogout}
                      onFocus={(e) => e.target.blur()}
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
              /* FIXED: Consistent auth button styling with navbar elements */
              <div className="auth-buttons">
                <Link
                  to="/login"
                  className="auth-btn auth-btn-login"
                  onFocus={(e) => e.target.blur()}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Login
                </Link>
                <Link
                  to="/register"
                  className="auth-btn auth-btn-register"
                  onFocus={(e) => e.target.blur()}
                >
                  <i className="fas fa-user-plus"></i>
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
