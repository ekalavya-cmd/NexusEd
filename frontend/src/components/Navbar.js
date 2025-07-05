import React, { useState, useContext, useEffect } from "react";
import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [darkMode, setDarkMode] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Check preferred color scheme and localStorage on component mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    if (storedDarkMode) {
      setDarkMode(storedDarkMode === "true");
    } else {
      const prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDarkMode);
    }
  }, []);

  // Update body data-bs-theme and localStorage when darkMode changes
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      darkMode ? "dark" : "light"
    );
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleLogout = () => {
    logout();
    setExpanded(false);
  };

  return (
    <BsNavbar
      expand="lg"
      className={`navbar bg-gradient-primary text-white shadow-sm mb-4`}
      expanded={expanded}
      onToggle={setExpanded}
    >
      <Container>
        <BsNavbar.Brand
          as={Link}
          to="/"
          className="text-white fw-bold d-flex align-items-center"
        >
          <i className="fas fa-graduation-cap me-2 fs-4"></i>
          NexusEd
        </BsNavbar.Brand>

        <Button
          variant="link"
          className="text-white ms-2 text-decoration-none d-flex d-lg-none position-relative"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
        </Button>

        <BsNavbar.Toggle aria-controls="basic-navbar-nav" className="border-0">
          <i className="fas fa-bars text-white"></i>
        </BsNavbar.Toggle>

        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            <Nav.Link
              as={RouterNavLink}
              to="/"
              className={({ isActive }) =>
                `text-white mx-1 ${isActive ? "active fw-bold" : ""}`
              }
              onClick={() => setExpanded(false)}
            >
              Home
            </Nav.Link>

            {user && (
              <>
                <Nav.Link
                  as={RouterNavLink}
                  to="/profile"
                  className={({ isActive }) =>
                    `text-white mx-1 ${isActive ? "active fw-bold" : ""}`
                  }
                  onClick={() => setExpanded(false)}
                >
                  Profile
                </Nav.Link>

                <Nav.Link
                  as={RouterNavLink}
                  to="/calendar"
                  className={({ isActive }) =>
                    `text-white mx-1 ${isActive ? "active fw-bold" : ""}`
                  }
                  onClick={() => setExpanded(false)}
                >
                  Calendar
                </Nav.Link>
              </>
            )}

            <Nav.Link
              as={RouterNavLink}
              to="/study-groups"
              className={({ isActive }) =>
                `text-white mx-1 ${isActive ? "active fw-bold" : ""}`
              }
              onClick={() => setExpanded(false)}
            >
              Study Groups
            </Nav.Link>

            <div className="ms-2 d-none d-lg-block">
              <Button
                variant="link"
                className="text-white text-decoration-none"
                onClick={toggleDarkMode}
                aria-label={
                  darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                <i className={`fas ${darkMode ? "fa-sun" : "fa-moon"}`}></i>
              </Button>
            </div>

            {user ? (
              <Button
                variant="outline-light"
                className="ms-2 btn-sm"
                onClick={handleLogout}
              >
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </Button>
            ) : (
              <>
                <Nav.Link
                  as={RouterNavLink}
                  to="/login"
                  className={({ isActive }) =>
                    `text-white mx-1 ${isActive ? "active fw-bold" : ""}`
                  }
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>

                <Nav.Link
                  as={RouterNavLink}
                  to="/register"
                  className={({ isActive }) =>
                    `text-white mx-1 ${isActive ? "active fw-bold" : ""}`
                  }
                  onClick={() => setExpanded(false)}
                >
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
}

export default Navbar;
