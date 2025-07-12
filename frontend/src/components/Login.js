import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Clear errors after 1.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Focus management for navigation
  const handleKeyDown = (e, currentField) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (currentField === "email" && password === "") {
        // If email field and password is empty, move to password field
        passwordRef.current?.focus();
      } else if (currentField === "email" && password !== "") {
        // If email field and password is filled, submit
        handleSubmit();
      } else if (currentField === "password") {
        // If password field, submit
        handleSubmit();
      }
    }
  };

  const addDebugLog = (message) => {
    console.log(`🔐 Login Debug: ${message}`);
  };

  const validateForm = () => {
    if (!emailOrUsername.trim() || !password.trim()) {
      setError("Please enter both email/username and password.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    addDebugLog("Form submission started");

    if (!validateForm()) {
      addDebugLog("Form validation failed");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      addDebugLog(`Attempting login for: ${emailOrUsername.toLowerCase()}`);

      // Convert to lowercase for case-insensitive login
      const identifier = emailOrUsername.toLowerCase().trim();

      const result = await login(identifier, password);

      if (result && result.success) {
        addDebugLog("Login successful, redirecting...");
        // Add a small delay to show success state
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        addDebugLog("Login failed with result: " + JSON.stringify(result));
        setError(
          result?.message || "Login failed. Please check your credentials."
        );
        setIsLoading(false);
      }
    } catch (err) {
      addDebugLog("Login error caught: " + err.message);
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your credentials."
      );
      setIsLoading(false);
    }
  };

  return (
    <Row className="justify-content-center align-items-center animate-fade-in-up">
      <Col md={8} lg={6} xl={5}>
        <Card className="auth-card shadow">
          <Card.Body>
            <div className="auth-header">
              <div className="auth-logo mx-auto">
                <i className="fas fa-graduation-cap text-primary fs-1"></i>
              </div>
              <h2>Welcome Back</h2>
              <p className="text-muted">Sign in to continue to NexusEd</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-4">
                <Form.Label>Email or Username</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    ref={emailRef}
                    value={emailOrUsername}
                    onChange={(e) => setEmailOrUsername(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                    placeholder="Enter your email or username"
                    autoComplete="username email"
                    disabled={isLoading}
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, "password")}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={isLoading}
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    <i
                      className={`fa-solid ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      }`}
                    ></i>
                  </Button>
                </InputGroup>
              </Form.Group>

              <div className="d-grid">
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  className="btn-hover-shadow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Logging in...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sign-in-alt me-2"></i>
                      Login
                    </>
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary fw-semibold transition-all hover-underline-effect"
                >
                  Register here
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Login;
