import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import axios from "axios";
import { format } from "date-fns";
import EventDetailsModal from "./EventDetailsModal";

// Add styles for message bubbles
const styles = `
  .message-bubble-received {
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    color: #212529;
  }
  
  [data-bs-theme="dark"] .message-bubble-received {
    background-color: #495057;
    border: 1px solid #6c757d;
    color: #f8f9fa;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

function GroupChat({ group, user, setTemporaryMessage, setTemporarySuccess }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileError, setFileError] = useState("");
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/study-groups/${group._id}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setMessages(response.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
        console.error("Error response:", err.response);
        console.error("API URL:", process.env.REACT_APP_API_URL);
        console.error("Group ID:", group._id);
        console.error("Token:", localStorage.getItem("token"));
        const errorMessage = err.response?.data?.message || `Failed to load messages. Status: ${err.response?.status || 'Network Error'}`;
        setTemporaryMessage(errorMessage);
        // Set empty messages array on error to show empty state instead of loading forever
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/events/group/${group._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Enhanced event filtering and categorization
        const currentTime = new Date();
        const currentDateString = currentTime.toDateString();
        
        // Sort all events by start time
        const sortedEvents = response.data.sort((a, b) => new Date(a.start) - new Date(b.start));

        // Today's events: events that occur today (start today or are ongoing today)
        const todayEvents = sortedEvents.filter((event) => {
          const eventStart = new Date(event.start);
          const eventEnd = new Date(event.end);
          
          // Event starts today OR event is currently ongoing (started before but ends after current time)
          return eventStart.toDateString() === currentDateString || 
                 (eventStart < currentTime && eventEnd > currentTime && eventStart.toDateString() !== currentDateString);
        });

        // Upcoming events: events that start after today
        const upcomingEvents = sortedEvents.filter((event) => {
          const eventStart = new Date(event.start);
          return eventStart.toDateString() !== currentDateString && eventStart > currentTime;
        });

        setEvents({ today: todayEvents, upcoming: upcomingEvents });
      } catch (err) {
        console.error("Error fetching events:", err);
        console.error("Events error response:", err.response);
        console.error("Events API URL:", `${process.env.REACT_APP_API_URL}/api/events/group/${group._id}`);
        const errorMessage = err.response?.data?.message || `Failed to load events. Status: ${err.response?.status || 'Network Error'}`;
        setTemporaryMessage(errorMessage);
        // Set empty events on error to show empty state
        setEvents({ today: [], upcoming: [] });
      } finally {
        setEventsLoading(false);
      }
    };

    fetchMessages();
    fetchEvents();

    // Set up periodic event refresh to handle date transitions and expired events
    const eventRefreshInterval = setInterval(() => {
      fetchEvents();
    }, 60000); // Refresh every minute

    return () => {
      clearInterval(eventRefreshInterval);
    };
  }, [group._id, setTemporaryMessage]);

  // Clear message errors after 3 seconds
  useEffect(() => {
    if (messageError) {
      const timer = setTimeout(() => {
        setMessageError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [messageError]);

  // Clear file errors after 3 seconds
  useEffect(() => {
    if (fileError) {
      const timer = setTimeout(() => {
        setFileError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [fileError]);

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

  useEffect(() => {
    if (shouldScrollToBottom) {
      scrollToBottom();
      setShouldScrollToBottom(false);
    }
  }, [shouldScrollToBottom]);

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();

    if (!message.trim() && selectedFiles.length === 0) {
      setMessageError("Please enter a message or attach a file.");
      return;
    }

    if (selectedFiles.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
      return;
    }

    setMessageError("");
    setFileError("");
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("content", message);

      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${group._id}/messages`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Add new message without auto-scroll
      setMessages(prevMessages => [...prevMessages, response.data]);
      setMessage("");
      setSelectedFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error sending message:", err);
      if (err.response?.status === 413) {
        setFileError("File size too large. Maximum size per file is 10MB.");
      } else {
        setMessageError("Failed to send message. Please try again.");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setFileError("");

    // Check file size (10MB max per file)
    const hasLargeFile = files.some((file) => file.size > 10 * 1024 * 1024);
    if (hasLargeFile) {
      setFileError("Some files exceed the maximum size of 10MB.");
    }

    // Check file count (5 max)
    if (files.length > 5) {
      setFileError("You can upload a maximum of 5 files.");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${group._id}/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update messages state without triggering scroll
      setMessages(prevMessages => prevMessages.filter((msg) => msg._id !== messageId));
      setTemporarySuccess("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      setTemporaryMessage("Failed to delete message. Please try again.");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/events/${eventId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update events state
      setEvents((prevEvents) => ({
        today: prevEvents.today.filter((event) => event._id !== eventId),
        upcoming: prevEvents.upcoming.filter((event) => event._id !== eventId),
      }));

      setTemporarySuccess("Event deleted successfully!");
    } catch (err) {
      console.error("Error deleting event:", err);
      setTemporaryMessage("Failed to delete event. Please try again.");
    }
  };

  const formatMessageDate = (dateString) => {
    const messageDate = new Date(dateString);
    const today = new Date();

    if (messageDate.toDateString() === today.toDateString()) {
      return `Today at ${format(messageDate, "p")}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${format(messageDate, "p")}`;
    }

    return format(messageDate, "PPP p");
  };

  const renderEventCard = (event, index) => (
    <Card
      key={event._id}
      className="mb-3 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={() => setSelectedEvent(event)}
    >
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="fs-5 mb-1">{event.title}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              {format(new Date(event.start), "PPP p")}
            </Card.Subtitle>
          </div>
          <i
            className="fa-solid fa-calendar-alt fs-5 text-primary"
            aria-label="View Calendar"
          ></i>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="chat-container">
      <div className="row">
        <div className="col-md-8 mb-4 mb-md-0">
          {/* Messages Section */}
          <div className="d-flex flex-column h-100">
            <div
              className="messages-container bg-light p-3 rounded border mb-3"
              style={{ height: "450px", overflowY: "auto" }}
            >
              {isLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3 text-secondary">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-5 text-secondary">
                  <i className="fas fa-comments fa-3x mb-3"></i>
                  <p>No messages yet. Start the conversation!</p>
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => {
                      setIsLoading(true);
                      // Re-run the fetch function
                      const fetchMessages = async () => {
                        try {
                          const response = await axios.get(
                            `${process.env.REACT_APP_API_URL}/api/study-groups/${group._id}/messages`,
                            {
                              headers: {
                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                              },
                            }
                          );
                          setMessages(response.data);
                        } catch (err) {
                          console.error("Error fetching messages:", err);
                          const errorMessage = err.response?.data?.message || "Failed to load messages. Please try again.";
                          setTemporaryMessage(errorMessage);
                          setMessages([]);
                        } finally {
                          setIsLoading(false);
                        }
                      };
                      fetchMessages();
                    }}
                  >
                    <i className="fas fa-refresh me-2"></i>
                    Retry Loading Messages
                  </Button>
                </div>
              ) : (
                <div>
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-3 ${
                        msg.author._id === user.id ? "text-end" : ""
                      }`}
                    >
                      {/* Username outside message container */}
                      <div className={`mb-1 ${
                        msg.author._id === user.id ? "text-end" : ""
                      }`}>
                        <small
                          className="text-muted fw-bold"
                          style={{ fontSize: "0.75rem" }}
                        >
                          {msg.author.username}
                        </small>
                      </div>
                      
                      <div
                        className={`d-inline-block p-2 rounded-3 shadow-sm position-relative ${
                          msg.author._id === user.id
                            ? "bg-primary text-white"
                            : "message-bubble-received"
                        }`}
                        style={{ 
                          maxWidth: "75%", 
                          fontSize: "0.9rem" 
                        }}
                      >

                        {msg.content && <p className="mb-0" style={{ fontSize: "0.85rem", lineHeight: "1.4" }}>{msg.content}</p>}

                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-1">
                            {msg.files.map((file) => {
                              const isImage = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(file.name);
                              
                              if (isImage) {
                                return (
                                  <div key={file._id} className="mb-2">
                                    <div className="position-relative">
                                      <img
                                        src={`${process.env.REACT_APP_API_URL}${file.url}`}
                                        alt={file.name}
                                        className="img-fluid rounded shadow-sm"
                                        style={{
                                          maxWidth: "250px",
                                          maxHeight: "200px",
                                          objectFit: "cover",
                                          cursor: "pointer"
                                        }}
                                        onClick={() => window.open(`${process.env.REACT_APP_API_URL}${file.url}`, '_blank')}
                                        loading="lazy"
                                        onError={(e) => {
                                          e.target.style.display = 'none';
                                          e.target.nextSibling.style.display = 'block';
                                        }}
                                      />
                                      <div 
                                        style={{ display: 'none' }}
                                        className={`d-flex align-items-center text-decoration-none ${
                                          msg.author._id === user.id
                                            ? "text-white"
                                            : "text-primary"
                                        }`}
                                      >
                                        <a
                                          href={`${process.env.REACT_APP_API_URL}${file.url}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`d-flex align-items-center text-decoration-none ${
                                            msg.author._id === user.id
                                              ? "text-white"
                                              : "text-primary"
                                          }`}
                                          style={{ fontSize: "0.8rem" }}
                                        >
                                          <i className="fas fa-image me-1" style={{ fontSize: "0.75rem" }}></i>
                                          <span className="text-truncate">{file.name}</span>
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              } else {
                                return (
                                  <div key={file._id} className="mb-1">
                                    <a
                                      href={`${process.env.REACT_APP_API_URL}${file.url}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`d-flex align-items-center text-decoration-none ${
                                        msg.author._id === user.id
                                          ? "text-white"
                                          : "text-primary"
                                      }`}
                                      style={{ fontSize: "0.8rem" }}
                                    >
                                      <i className="fas fa-file-download me-1" style={{ fontSize: "0.75rem" }}></i>
                                      <span className="text-truncate">{file.name}</span>
                                    </a>
                                  </div>
                                );
                              }
                            })}
                          </div>
                        )}
                      </div>
                      
                      {/* Timestamp and delete button outside message container */}
                      <div 
                        className={`mt-1 d-flex align-items-center gap-2 ${
                          msg.author._id === user.id ? "justify-content-end" : ""
                        }`}
                      >
                        <small
                          className="text-muted"
                          style={{ fontSize: "0.65rem" }}
                        >
                          {formatMessageDate(msg.createdAt)}
                        </small>
                        {msg.author._id === user.id && (
                          <button
                            className="btn btn-sm p-0 border-0 bg-transparent text-muted"
                            onClick={() => handleDeleteMessage(msg._id)}
                            style={{
                              fontSize: "0.65rem",
                              lineHeight: 1,
                              opacity: 0.7
                            }}
                            title="Delete message"
                            onMouseEnter={(e) => e.target.style.opacity = 1}
                            onMouseLeave={(e) => e.target.style.opacity = 0.7}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messageEndRef}></div>
                </div>
              )}
            </div>

            <Form onSubmit={handleSendMessage}>
              {messageError && (
                <Alert variant="danger" className="py-2 mb-2">
                  {messageError}
                </Alert>
              )}

              {fileError && (
                <Alert variant="danger" className="py-2 mb-2">
                  {fileError}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <InputGroup className="shadow-sm">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
                    disabled={isSending}
                    className="border-end-0"
                    style={{
                      resize: "none",
                      fontSize: "0.9rem",
                      borderRadius: "0.5rem 0 0 0.5rem"
                    }}
                  />
                  <Button
                    variant="outline-secondary"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isSending}
                    className="border-start-0 px-3"
                    style={{
                      borderRadius: "0 0.5rem 0.5rem 0",
                      borderColor: "#dee2e6"
                    }}
                    title="Attach files"
                  >
                    <i className="fas fa-paperclip"></i>
                  </Button>
                </InputGroup>

                <Form.Control
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="d-none"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <Form.Text className="text-muted" style={{ fontSize: "0.75rem" }}>
                  Supported: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (Max 5 files, 10MB each)
                </Form.Text>

                {selectedFiles.length > 0 && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <small className="text-muted d-flex align-items-center">
                      <i className="fas fa-paperclip me-1"></i>
                      {selectedFiles.length} file(s) selected
                    </small>
                    <div className="mt-1">
                      {selectedFiles.map((file, index) => (
                        <small key={index} className="d-block text-truncate" style={{ fontSize: "0.75rem" }}>
                          {file.name}
                        </small>
                      ))}
                    </div>
                  </div>
                )}
              </Form.Group>

              <div className="d-grid">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    isSending || (!message.trim() && selectedFiles.length === 0)
                  }
                  className="btn-hover-shadow"
                >
                  {isSending ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane me-2"></i>
                      Send Message
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </div>
        </div>

        <div className="col-md-4">
          {/* Events Section */}
          <div>
            <h4 className="mb-3 fs-5 fw-semibold text-primary">
              <i className="fas fa-calendar me-2"></i>
              Upcoming Events
            </h4>

            {eventsLoading ? (
              <div className="text-center py-3">
                <Spinner animation="border" variant="primary" size="sm" />
                <p className="mt-2 text-secondary">Loading events...</p>
              </div>
            ) : (
              <>
                {/* Today's Events */}
                <h5 className="mb-2 fs-6 fw-semibold">Today's Events</h5>
                {events.today && events.today.length > 0 ? (
                  events.today.map((event, index) =>
                    renderEventCard(event, index)
                  )
                ) : (
                  <p className="text-secondary small">
                    No events scheduled for today.
                  </p>
                )}

                {/* Upcoming Events */}
                <h5 className="mb-2 mt-4 fs-6 fw-semibold">Future Events</h5>
                {events.upcoming && events.upcoming.length > 0 ? (
                  events.upcoming.map((event, index) =>
                    renderEventCard(event, index)
                  )
                ) : (
                  <p className="text-secondary small">No upcoming events.</p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <EventDetailsModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        user={user}
        handleDeleteEvent={handleDeleteEvent}
        hideViewGroupButton={true}
      />
    </div>
  );
}

export default GroupChat;
