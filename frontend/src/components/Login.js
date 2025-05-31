import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  // Refs for input fields
  const identifierRef = useRef(null);
  const passwordRef = useRef(null);

  // Constants for validation (consistent with Register page)
  const USERNAME_MIN_LENGTH = 3;
  const USERNAME_MAX_LENGTH = 20;
  const PASSWORD_MIN_LENGTH = 8;

  const setTemporaryError = (message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(message);
    timeoutRef.current = setTimeout(() => {
      setError("");
      timeoutRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Check for empty fields
    if (!identifier.trim() || !password.trim()) {
      setTemporaryError("All fields are required");
      setIsLoading(false);
      return;
    }

    // Identifier validation (email or username)
    const isEmail = identifier.includes("@");
    if (isEmail) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) {
        setTemporaryError("Please enter a valid email address");
        setIsLoading(false);
        return;
      }
    } else {
      if (
        identifier.length < USERNAME_MIN_LENGTH ||
        identifier.length > USERNAME_MAX_LENGTH
      ) {
        setTemporaryError(
          `Username must be between ${USERNAME_MIN_LENGTH} and ${USERNAME_MAX_LENGTH} characters`
        );
        setIsLoading(false);
        return;
      }
      if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
        setTemporaryError(
          "Username can only contain letters, numbers, and underscores"
        );
        setIsLoading(false);
        return;
      }
    }

    // Password validation
    if (password.length < PASSWORD_MIN_LENGTH) {
      setTemporaryError(
        `Password must be at least ${PASSWORD_MIN_LENGTH} characters`
      );
      setIsLoading(false);
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setTemporaryError("Password must contain at least one uppercase letter");
      setIsLoading(false);
      return;
    }

    if (!/[a-z]/.test(password)) {
      setTemporaryError("Password must contain at least one lowercase letter");
      setIsLoading(false);
      return;
    }

    if (!/[0-9]/.test(password)) {
      setTemporaryError("Password must contain at least one number");
      setIsLoading(false);
      return;
    }

    if (!/[!@#$%^&*]/.test(password)) {
      setTemporaryError(
        "Password must contain at least one special character (e.g., !@#$%^&*)"
      );
      setIsLoading(false);
      return;
    }

    // Proceed with login
    const result = await login(identifier, password);
    setIsLoading(false);
    if (result.success) {
      navigate("/");
    } else {
      setTemporaryError(result.message);
    }
  };

  // Handle Enter key press to navigate between fields or submit
  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextRef) {
        nextRef.current.focus();
      } else {
        handleSubmit(e);
      }
    }
  };

  // Handle Enter key press on the eye button to toggle visibility
  const handleEyeKeyDown = (e, toggleFunction) => {
    if (e.key === "Enter") {
      e.preventDefault();
      toggleFunction((prev) => !prev);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 flex items-start justify-center py-4">
      <style>
        {`
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
            50% { box-shadow: 0 0 15px rgba(209, 213, 219, 0.5); }
            100% { box-shadow: 0 0 5px rgba(209, 213, 219, 0.3); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          .dark-glow {
            animation: glow 2s infinite ease-in-out;
          }
          .hover-underline::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: 0;
            left: 0;
            background: linear-gradient(to right, #2563eb, #4f46e5);
            transition: width 0.3s ease-in-out;
          }
          .dark .hover-underline::after {
            background: linear-gradient(to right, #9ca3af, #d1d5db);
          }
          .hover-underline:hover::after {
            width: 100%;
          }
        `}
      </style>
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-8 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 max-w-md w-full animate-fade-in-up hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] transition-all duration-300">
        <h2 className="relative text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-6 hover-underline">
          Login
        </h2>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md animate-fade-in-up hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300">
            {error}
          </div>
        )}
        <form>
          <div className="mb-5">
            <label
              htmlFor="identifier"
              className="block text-gray-700 dark:text-gray-400 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
            >
              Email or Username
            </label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              placeholder="Enter email or username"
              className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
              ref={identifierRef}
              required
              aria-required="true"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-400 mb-2 font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-400 dark:to-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, null)}
                placeholder="Enter password"
                className="w-full p-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
                ref={passwordRef}
                required
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                onKeyDown={(e) => handleEyeKeyDown(e, setShowPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-amber-400 transition-all duration-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <i
                  className={`fa-solid ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                ></i>
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:bg-blue-700 dark:hover:bg-teal-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50"
            disabled={isLoading}
            aria-label="Login"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-6 text-gray-600 dark:text-gray-200 text-center">
          Don't have an account?{" "}
          <a
            href="/register"
            className="relative bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 hover-underline transition-all duration-300"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
