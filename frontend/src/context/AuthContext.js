import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Create the authentication context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

  // Enhanced login function with proper error handling and return values
  const login = async (identifier, password) => {
    try {
      console.log("AuthContext login - Identifier:", identifier);

      // Convert identifier to lowercase for case-insensitive login
      const normalizedIdentifier = identifier.toLowerCase().trim();

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { identifier: normalizedIdentifier, password }
      );

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        console.log(
          "AuthContext login - Success for user:",
          response.data.user.username
        );
        return { success: true, user: response.data.user };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error(
        "AuthContext login - Error:",
        err.response?.data || err.message
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials.";

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Enhanced register function with proper error handling and return values
  const register = async (username, email, password) => {
    try {
      console.log(
        "AuthContext register - Starting registration for:",
        username
      );

      // Normalize inputs
      const normalizedEmail = email.toLowerCase().trim();
      const trimmedUsername = username.trim();

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          username: trimmedUsername,
          email: normalizedEmail,
          password,
        }
      );

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        setUser(response.data.user);
        console.log(
          "AuthContext register - Success for user:",
          response.data.user.username
        );
        return { success: true, user: response.data.user };
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error(
        "AuthContext register - Error:",
        err.response?.data || err.message
      );

      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Registration failed. Please try again.";

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Logout function - unchanged
  const logout = () => {
    console.log("AuthContext logout - Logging out user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
