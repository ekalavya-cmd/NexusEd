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
        setTemporaryMessage("Failed to load messages. Please try again.");
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

        // Filter events
        const currentDate = new Date();
        const upcoming = response.data
          .filter((event) => new Date(event.end) > currentDate)
          .sort((a, b) => new Date(a.start) - new Date(b.start));

        const today = upcoming.filter(
          (event) =>
            new Date(event.start).toDateString() === currentDate.toDateString()
        );

        const future = upcoming.filter(
          (event) =>
            new Date(event.start).toDateString() !== currentDate.toDateString()
        );

        setEvents({ today, upcoming: future });
      } catch (err) {
        console.error("Error fetching events:", err);
        setTemporaryMessage("Failed to load events. Please try again.");
      } finally {
        setEventsLoading(false);
      }
    };

    fetchMessages();
    fetchEvents();
  }, [group._id, setTemporaryMessage]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

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

      setMessages([...messages, response.data]);
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
              style={{ height: "400px", overflowY: "auto" }}
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
                </div>
              ) : (
                <div>
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-3 ${
                        msg.sender._id === user.id ? "text-end" : ""
                      }`}
                    >
                      <div
                        className={`d-inline-block p-3 rounded-3 shadow-sm ${
                          msg.sender._id === user.id
                            ? "bg-primary text-white"
                            : "bg-white border"
                        }`}
                        style={{ maxWidth: "80%" }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small
                            className={
                              msg.sender._id === user.id
                                ? "text-white"
                                : "text-primary"
                            }
                          >
                            <strong>{msg.sender.username}</strong>
                          </small>
                          <small
                            className={
                              msg.sender._id === user.id
                                ? "text-white"
                                : "text-muted"
                            }
                          >
                            {formatMessageDate(msg.createdAt)}
                          </small>
                        </div>

                        {msg.content && <p className="mb-2">{msg.content}</p>}

                        {msg.files && msg.files.length > 0 && (
                          <div className="mt-2">
                            {msg.files.map((file) => (
                              <div key={file._id} className="mb-1">
                                <a
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={`d-flex align-items-center ${
                                    msg.sender._id === user.id
                                      ? "text-white"
                                      : "text-primary"
                                  }`}
                                >
                                  <i className="fas fa-file-download me-2"></i>
                                  {file.originalname}
                                </a>
                              </div>
                            ))}
                          </div>
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
                <InputGroup>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isSending}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={() => fileInputRef.current.click()}
                    disabled={isSending}
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
                />

                {selectedFiles.length > 0 && (
                  <div className="mt-2">
                    <small className="text-muted">
                      {selectedFiles.length} file(s) selected
                    </small>
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
