import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { isDateValid } from "../utils/dateUtils";
import EventDetailsModal from "./EventDetailsModal";

function GroupChat({ groupId, messages, setGroup, currentUser }) {
  const [messageContent, setMessageContent] = useState("");
  const [error, setError] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const timeoutRef = useRef(null);
  const messageInputRef = useRef(null);
  const postMessageButtonRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

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

  // Fetch events for the group
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Authentication token missing. Please log in again.");
        }

        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/api/events/group/${groupId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response from server:", errorText);
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || "Failed to fetch events");
        }

        const eventsData = await response.json();
        console.log("Fetched events:", eventsData);

        // Current date and time: 01:12 AM IST, May 31, 2025
        const currentDate = new Date("2025-05-31T01:12:00+05:30");
        const todayStart = new Date("2025-05-31T00:00:00+05:30"); // Start of May 31, 2025 IST
        const todayEnd = new Date("2025-05-31T23:59:59+05:30"); // End of May 31, 2025 IST

        // Filter events: exclude those that have ended
        const activeEvents = eventsData.filter((event) => {
          const endDate = new Date(event.end);
          return endDate > currentDate; // Only keep events that haven't ended
        });

        // Today's Events: start date is on May 31, 2025
        const todayEventsFiltered = activeEvents.filter((event) => {
          const startDate = new Date(event.start);
          return startDate >= todayStart && startDate <= todayEnd;
        });

        // Upcoming Events: start date is after May 31, 2025
        const upcomingEventsFiltered = activeEvents.filter((event) => {
          const startDate = new Date(event.start);
          return startDate > todayEnd; // After May 31, 2025
        });

        setTodayEvents(todayEventsFiltered);
        setUpcomingEvents(upcomingEventsFiltered);
      } catch (err) {
        console.error("Fetch events error:", err);
        setTemporaryError(err.message || "Failed to fetch events");
      }
    };

    fetchEvents();
  }, [groupId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes

    const validFiles = files.filter((file) => {
      if (!allowedTypes.includes(file.type)) {
        setTemporaryError(
          `File type not allowed for ${file.name}. Allowed types: images, PDFs, text, Word documents.`
        );
        return false;
      }
      if (file.size > maxSize) {
        setTemporaryError(
          `File ${file.name} is too large. Maximum size is 10MB.`
        );
        return false;
      }
      return true;
    });

    setSelectedFiles((prev) => [...prev, ...validFiles]);
    e.target.value = null; // Reset file input
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsPosting(true);

    if (postMessageButtonRef.current) {
      postMessageButtonRef.current.blur();
    }

    if (!messageContent.trim() && selectedFiles.length === 0) {
      setTemporaryError("Message or file is required");
      setIsPosting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      const formData = new FormData();
      formData.append("content", messageContent);
      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post message");
      }

      const updatedGroup = await response.json();
      setGroup(updatedGroup);
      setMessageContent("");
      setSelectedFiles([]);
    } catch (err) {
      setTemporaryError(err.message || "Failed to post message");
    } finally {
      setIsPosting(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/study-groups/${groupId}/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete message");
      }

      const updatedGroup = await response.json();
      setGroup(updatedGroup);
    } catch (err) {
      setTemporaryError(err.message || "Failed to delete message");
    }
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token missing. Please log in again.");
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/events/${selectedEvent._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete event");
      }

      // Remove the deleted event from both lists
      setTodayEvents(
        todayEvents.filter((event) => event._id !== selectedEvent._id)
      );
      setUpcomingEvents(
        upcomingEvents.filter((event) => event._id !== selectedEvent._id)
      );
      setSelectedEvent(null); // Close the modal
    } catch (err) {
      setTemporaryError(err.message || "Failed to delete event");
    }
  };

  const handleMessageKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) {
        e.preventDefault();
        setMessageContent(messageContent + "\n");
      } else {
        e.preventDefault();
        handleMessageSubmit(e);
      }
    }
  };

  const formatDateTime = (date) => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    return formatter.format(new Date(date)).replace(" at", ",");
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "fa-solid fa-file-pdf text-red-500";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "fa-solid fa-file-image text-blue-500";
      case "doc":
      case "docx":
        return "fa-solid fa-file-word text-blue-700";
      case "txt":
        return "fa-solid fa-file-text text-gray-500";
      default:
        return "fa-solid fa-file text-gray-500";
    }
  };

  // Common render function for event cards
  const renderEventCard = (event, index) => (
    <div
      key={event._id}
      onClick={() => setSelectedEvent(event)}
      className="bg-gradient-to-r from-gray-50 to-green-50 dark:from-gray-700 dark:to-gray-600 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up cursor-pointer"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-800 dark:text-gray-200 font-semibold">
            {event.title}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            <strong>Start:</strong>{" "}
            {isDateValid(new Date(event.start))
              ? format(new Date(event.start), "PPP p")
              : "Invalid Date"}
          </p>
        </div>
        <i
          className="fa-solid fa-calendar-alt text-lg cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-purple-500 transition-all duration-300"
          onClick={(e) => {
            e.stopPropagation();
            navigate("/calendar");
          }}
          aria-label="View Calendar"
        ></i>
      </div>
    </div>
  );

  return (
    <div className="mt-6">
      {/* Event Details Modal */}
      <EventDetailsModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        user={currentUser}
        handleDeleteEvent={handleDeleteEvent}
        hideViewGroupButton={true}
      />

      {/* Today's Events Section */}
      <h4 className="relative text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-4 hover-underline">
        Today's Events
      </h4>
      {todayEvents.length > 0 ? (
        <div className="space-y-4 mb-6">
          {todayEvents.map((event, index) => renderEventCard(event, index))}
        </div>
      ) : (
        <p className="text-sm mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-200">
          No events scheduled for today.
        </p>
      )}

      {/* Upcoming Events Section */}
      <h4 className="relative text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-4 hover-underline">
        Upcoming Events
      </h4>
      {upcomingEvents.length > 0 ? (
        <div className="space-y-4 mb-6">
          {upcomingEvents.map((event, index) => renderEventCard(event, index))}
        </div>
      ) : (
        <p className="text-sm mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-200">
          No upcoming events.
        </p>
      )}

      {/* Discussion Board */}
      <h4 className="relative text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-4 hover-underline">
        Discussion Board
      </h4>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up">
          {error}
        </div>
      )}
      {messages && messages.length > 0 ? (
        <div className="space-y-4 mb-6">
          {messages.map((message, index) => (
            <div
              key={message._id}
              className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {message.content && (
                <p className="text-gray-600 dark:text-gray-200 mb-2 transition-all duration-200">
                  {message.content}
                </p>
              )}
              {message.files && message.files.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-2">
                  {message.files.map((file, fileIndex) => (
                    <a
                      key={fileIndex}
                      href={`${process.env.REACT_APP_API_URL}${file.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-sm bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300"
                      aria-label={`Download ${file.name}`}
                    >
                      <i className={getFileIcon(file.name)}></i>
                      <span className="truncate max-w-[150px]">
                        {file.name}
                      </span>
                    </a>
                  ))}
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-sm bg-clip-text text-transparent bg-gradient-to-r from-gray-500 to-gray-700 dark:from-gray-400 dark:to-gray-300 transition-all duration-200">
                  By {message.author?.username || "Unknown"} on{" "}
                  {formatDateTime(message.createdAt)}
                </p>
                {currentUser &&
                  message.author?._id?.toString() === currentUser.id && (
                    <button
                      onClick={() => handleDeleteMessage(message._id)}
                      className="bg-gradient-to-r from-red-600 to-red-800 dark:from-red-700 dark:to-red-600 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
                      aria-label={`Delete message by ${
                        message.author?.username || "Unknown"
                      }`}
                    >
                      <i className="fa-solid fa-trash"></i>
                      <span>Delete</span>
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 transition-transform duration-200">
          No messages yet. Be the first to post!
        </p>
      )}
      {currentUser && (
        <form onSubmit={handleMessageSubmit}>
          <div className="relative">
            <textarea
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              onKeyDown={handleMessageKeyDown}
              placeholder="Post a message..."
              className="w-full p-3 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 mb-4 text-gray-900 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              rows="3"
              ref={messageInputRef}
              disabled={isPosting}
              aria-label="Post a Message"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-cyan-500 transition-all duration-300"
              disabled={isPosting}
              aria-label="Attach Files"
            >
              <i className="fa-solid fa-paperclip text-lg"></i>
            </button>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              disabled={isPosting}
              aria-label="Upload Files"
            />
          </div>
          {selectedFiles.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md"
                >
                  <i className={getFileIcon(file.name)}></i>
                  <span className="truncate max-w-[150px]">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeSelectedFile(index)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    disabled={isPosting}
                    aria-label={`Remove ${file.name}`}
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 flex items-center space-x-1"
            disabled={isPosting}
            ref={postMessageButtonRef}
            aria-label="Post Message"
          >
            {isPosting ? (
              <>
                <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                <span>Posting...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                <span>Post Message</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default GroupChat;
