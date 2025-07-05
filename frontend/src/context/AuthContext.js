import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { Toast, ToastContainer } from "react-bootstrap";

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // Check for existing token on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data); // Updated to handle flat response
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(
            "Error fetching user:",
            err.response?.data || err.message
          );
          localStorage.removeItem("token");
          setUser(null);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  // Handle authentication errors with Bootstrap Toast
  useEffect(() => {
    if (authError) {
      setShowToast(true);
      const timer = setTimeout(() => {
        setShowToast(false);
        setAuthError(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [authError]);

  // Login function - unchanged API calls but updated error handling
  const login = async (identifier, password) => {
    try {
      console.log("AuthContext login - Identifier:", identifier);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { identifier, password }
      );
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      console.log(
        "AuthContext login - Success for user:",
        response.data.user.username
      );
      return { success: true };
    } catch (err) {
      console.error(
        "AuthContext login - Error:",
        err.response?.data || err.message
      );
      setAuthError(err.response?.data?.message || "Login failed");
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

  // Register function - unchanged API calls but updated error handling
  const register = async (username, email, password) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { username, email, password }
      );
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      console.error(
        "AuthContext register - Error:",
        err.response?.data || err.message
      );
      setAuthError(err.response?.data?.message || "Registration failed");
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  // Logout function - unchanged
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, login, register, logout }}
    >
      {children}

      {/* Bootstrap Toast for displaying auth errors */}
      <ToastContainer
        position="top-center"
        className="p-3"
        style={{ zIndex: 1100 }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          bg="danger"
          delay={3000}
          autohide
        >
          <Toast.Header>
            <strong className="me-auto">Authentication Error</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{authError}</Toast.Body>
        </Toast>
      </ToastContainer>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
