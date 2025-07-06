import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "react-bootstrap";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import StudyGroups from "./components/StudyGroups";
import GroupDetail from "./components/GroupDetail";
import Profile from "./components/Profile";
import Login from "./components/Login";
import Register from "./components/Register";
import CalendarPage from "./components/CalendarPage";
import Footer from "./components/Footer";

// Import theme validator for development
import { validateThemeConsistency } from "./utils/themeValidator";

function App() {
  useEffect(() => {
    // Initialize theme validation in development
    if (process.env.NODE_ENV === "development") {
      // Add debug theme attribute
      document.documentElement.setAttribute(
        "data-theme-debug",
        document.documentElement.getAttribute("data-bs-theme") || "light"
      );

      // Validate theme consistency on mount
      setTimeout(() => {
        validateThemeConsistency();
      }, 1000);

      // Add to window for manual testing
      window.validateTheme = validateThemeConsistency;
    }
  }, []);

  return (
    <div className="App d-flex flex-column min-vh-100">
      <Navbar />
      <main className="main-content flex-grow-1 py-4">
        <Container>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/study-groups" element={<StudyGroups />} />
            <Route path="/groups/:groupId" element={<GroupDetail />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </div>
  );
}

export default App;
