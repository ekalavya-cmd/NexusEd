import React, { useState, useContext, useRef, useEffect } from "react";
import {
  Card,
  Form,
  Button,
  InputGroup,
  Row,
  Col,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: "Enter a password",
    color: "secondary",
    criteria: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    },
  });

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Update password strength on change
  useEffect(() => {
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength({
        score: 0,
        feedback: "Enter a password",
        color: "secondary",
        criteria: {
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
        },
      });
    }
  }, [password]);

  // Clear errors after 1.5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError("");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async () => {
    addDebugLog("Form submission started");

    if (!validateForm()) {
      addDebugLog("Form validation failed");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      addDebugLog("Attempting registration");

      const result = await register(username, email, password);

      if (result && result.success) {
        addDebugLog("Registration successful, redirecting...");
        // Add a small delay to show success state
        setTimeout(() => {
          navigate("/");
        }, 500);
      } else {
        addDebugLog("Registration failed: " + JSON.stringify(result));
        setError(
          result?.message || "Registration failed. Please try again later."
        );
        setIsLoading(false);
      }
    } catch (err) {
      addDebugLog("Registration error caught: " + err.message);
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registration failed. Please try again later."
      );
      setIsLoading(false);
    }
  };

  const calculatePasswordStrength = (pwd) => {
    const criteria = {
      length: pwd.length >= 8,
      lowercase: /[a-z]/.test(pwd),
      uppercase: /[A-Z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };

    const score = Object.values(criteria).filter(Boolean).length;

    let feedback, color;

    if (score === 0) {
      feedback = "Enter a password";
      color = "secondary";
    } else if (score <= 2) {
      feedback = "Very weak password";
      color = "danger";
    } else if (score === 3) {
      feedback = "Weak password";
      color = "warning";
    } else if (score === 4) {
      feedback = "Good password";
      color = "info";
    } else {
      feedback = "Strong password";
      color = "success";
    }

    return { score: (score / 5) * 100, feedback, color, criteria };
  };

  // Focus management for navigation
  const handleKeyDown = (e, currentField) => {
    if (e.key === "Enter") {
      e.preventDefault();

      switch (currentField) {
        case "username":
          if (email === "") {
            emailRef.current?.focus();
          } else if (password === "") {
            passwordRef.current?.focus();
          } else if (confirmPassword === "") {
            confirmPasswordRef.current?.focus();
          } else {
            handleSubmit();
          }
          break;
        case "email":
          if (password === "") {
            passwordRef.current?.focus();
          } else if (confirmPassword === "") {
            confirmPasswordRef.current?.focus();
          } else {
            handleSubmit();
          }
          break;
        case "password":
          if (confirmPassword === "") {
            confirmPasswordRef.current?.focus();
          } else {
            handleSubmit();
          }
          break;
        case "confirmPassword":
          handleSubmit();
          break;
        default:
          break;
      }
    }
  };

  const addDebugLog = (message) => {
    console.log(`📝 Register Debug: ${message}`);
  };

  const validateForm = () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword) {
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

    if (username.length < 3) {
      setError("Username must be at least 3 characters long.");
      return false;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError("Username can only contain letters, numbers, and underscores.");
      return false;
    }

    return true;
  };

  return (
    <Row className="justify-content-center align-items-center animate-fade-in-up">
      <Col md={8} lg={6} xl={5}>
        <Card className="auth-card shadow">
          <Card.Body>
            <div className="auth-header">
              <div className="auth-logo mx-auto">
                <i className="fas fa-user-plus text-primary fs-1"></i>
              </div>
              <h2>Create an Account</h2>
              <p className="text-muted">Join the NexusEd student community</p>
            </div>

            {error && (
              <Alert variant="danger" className="mb-4">
                <i className="fas fa-exclamation-circle me-2"></i>
                {error}
              </Alert>
            )}

            <Form>
              <Form.Group className="mb-4">
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
                    onKeyDown={(e) => handleKeyDown(e, "username")}
                    placeholder="Choose a username"
                    autoComplete="username"
                    disabled={isLoading}
                    required
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  3+ characters, letters, numbers, and underscores only
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
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
                    onKeyDown={(e) => handleKeyDown(e, "email")}
                    placeholder="Enter your email"
                    autoComplete="email"
                    disabled={isLoading}
                    required
                  />
                </InputGroup>
                <Form.Text className="text-muted">
                  Will be converted to lowercase automatically
                </Form.Text>
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
                    placeholder="Create a password"
                    autoComplete="new-password"
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

                {password && (
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="small">{passwordStrength.feedback}</span>
                      <span className="small">
                        {Math.round(passwordStrength.score)}%
                      </span>
                    </div>
                    <ProgressBar
                      now={passwordStrength.score}
                      variant={passwordStrength.color}
                      className="mb-3"
                      style={{ height: "6px" }}
                    />

                    <div className="password-criteria">
                      <div className="row">
                        <div className="col-12 col-sm-6">
                          <small
                            className={
                              passwordStrength.criteria.length
                                ? "text-success"
                                : "text-muted"
                            }
                          >
                            <i
                              className={`fas ${
                                passwordStrength.criteria.length
                                  ? "fa-check"
                                  : "fa-times"
                              } me-1`}
                            ></i>
                            At least 8 characters
                          </small>
                        </div>
                        <div className="col-12 col-sm-6">
                          <small
                            className={
                              passwordStrength.criteria.lowercase
                                ? "text-success"
                                : "text-muted"
                            }
                          >
                            <i
                              className={`fas ${
                                passwordStrength.criteria.lowercase
                                  ? "fa-check"
                                  : "fa-times"
                              } me-1`}
                            ></i>
                            Lowercase letter
                          </small>
                        </div>
                        <div className="col-12 col-sm-6">
                          <small
                            className={
                              passwordStrength.criteria.uppercase
                                ? "text-success"
                                : "text-muted"
                            }
                          >
                            <i
                              className={`fas ${
                                passwordStrength.criteria.uppercase
                                  ? "fa-check"
                                  : "fa-times"
                              } me-1`}
                            ></i>
                            Uppercase letter
                          </small>
                        </div>
                        <div className="col-12 col-sm-6">
                          <small
                            className={
                              passwordStrength.criteria.number
                                ? "text-success"
                                : "text-muted"
                            }
                          >
                            <i
                              className={`fas ${
                                passwordStrength.criteria.number
                                  ? "fa-check"
                                  : "fa-times"
                              } me-1`}
                            ></i>
                            Number
                          </small>
                        </div>
                        <div className="col-12">
                          <small
                            className={
                              passwordStrength.criteria.special
                                ? "text-success"
                                : "text-muted"
                            }
                          >
                            <i
                              className={`fas ${
                                passwordStrength.criteria.special
                                  ? "fa-check"
                                  : "fa-times"
                              } me-1`}
                            ></i>
                            Special character (!@#$%^&*...)
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                    onKeyDown={(e) => handleKeyDown(e, "confirmPassword")}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    disabled={isLoading}
                    required
                  />
                </InputGroup>
                {confirmPassword && password !== confirmPassword && (
                  <small className="text-danger">
                    <i className="fas fa-times me-1"></i>
                    Passwords do not match
                  </small>
                )}
                {confirmPassword && password === confirmPassword && (
                  <small className="text-success">
                    <i className="fas fa-check me-1"></i>
                    Passwords match
                  </small>
                )}
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
                    <>
                      <i className="fas fa-user-plus me-2"></i>
                      Register
                    </>
                  )}
                </Button>
              </div>
            </Form>

            <div className="text-center mt-4">
              <p>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-primary fw-semibold transition-all hover-underline-effect"
                >
                  Login here
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
