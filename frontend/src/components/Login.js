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

function Login() {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      await login(email, password);
      // If successful, login will redirect
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
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
              <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
              <h2 className="fw-bold">Login to NexusEd</h2>
              <p className="text-muted">Access your student community</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                {error}
              </Alert>
            )}

            <Form onKeyDown={handleKeyDown}>
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
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                    "Login"
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-primary fw-semibold transition-all"
                >
                  Register
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
