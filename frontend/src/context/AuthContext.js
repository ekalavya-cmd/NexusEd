import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };

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
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
