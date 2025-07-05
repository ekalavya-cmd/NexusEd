import React, { useState, useContext, useRef } from "react";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError("");
      await register(username, email, password);
      // If successful, register will redirect
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} lg={5}>
        <Card className="shadow animate-fade-in-up">
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <i className="fas fa-user-plus fa-3x text-primary mb-3"></i>
              <h2 className="fw-bold">Create an Account</h2>
              <p className="text-muted">Join the NexusEd student community</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Form onKeyDown={handleKeyDown}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-user"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    ref={usernameRef}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    autoComplete="username"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-envelope"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    ref={emailRef}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-3">
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
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
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
                <Form.Text className="text-muted">
                  Password must be at least 8 characters long
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup>
                  <InputGroup.Text>
                    <i className="fas fa-lock"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    ref={confirmPasswordRef}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    required
                  />
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
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary fw-semibold transition-all"
                >
                  Login
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}

export default Register;
