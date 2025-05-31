import React, { useRef } from "react";
import { isDateValid, safeFormat } from "../utils/dateUtils";

const CreateEventModal = ({
  showModal,
  setShowModal,
  newEvent,
  setNewEvent,
  currentDateTime,
  groups,
  fieldErrors,
  handleCreateEvent,
}) => {
  // Refs for focusing inputs and buttons
  const titleInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const startInputRef = useRef(null);
  const endInputRef = useRef(null);
  const groupSelectRef = useRef(null);
  const createButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Handle Enter key to move focus to the next field
  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      descriptionInputRef.current.focus();
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      startInputRef.current.focus();
    }
  };

  const handleStartKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      endInputRef.current.focus();
    }
  };

  const handleEndKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      groupSelectRef.current.focus();
    }
  };

  const handleGroupKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      createButtonRef.current.focus();
    }
  };

  // Handle arrow key navigation between buttons
  const handleCreateButtonKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      cancelButtonRef.current.focus();
    }
  };

  const handleCancelButtonKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      createButtonRef.current.focus();
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 dark:text-amber-200 mb-4">
          Create New Event
        </h2>
        <div className="mb-4">
          <label
            htmlFor="event-title"
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium"
          >
            Title
          </label>
          <input
            type="text"
            id="event-title"
            ref={titleInputRef}
            value={newEvent.title}
            onChange={(e) =>
              setNewEvent({ ...newEvent, title: e.target.value })
            }
            onKeyDown={handleTitleKeyDown}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Event title"
            aria-label="Event Title"
          />
          {fieldErrors.title && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {fieldErrors.title}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="event-description"
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium"
          >
            Description
          </label>
          <textarea
            id="event-description"
            ref={descriptionInputRef}
            value={newEvent.description}
            onChange={(e) =>
              setNewEvent({ ...newEvent, description: e.target.value })
            }
            onKeyDown={handleDescriptionKeyDown}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
            rows="3"
            placeholder="Event description (Shift + Enter for new line)"
            aria-label="Event Description"
          />
          {fieldErrors.description && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {fieldErrors.description}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="event-start"
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium"
          >
            Start Time
          </label>
          <input
            type="datetime-local"
            id="event-start"
            ref={startInputRef}
            value={safeFormat(
              newEvent.start,
              "yyyy-MM-dd'T'HH:mm",
              currentDateTime
            )}
            onChange={(e) => {
              const newStart = new Date(e.target.value);
              if (isDateValid(newStart)) {
                setNewEvent((prev) => ({
                  ...prev,
                  start: newStart,
                  end:
                    prev.end <= newStart
                      ? new Date(newStart.getTime() + 60 * 60 * 1000)
                      : prev.end,
                }));
              }
            }}
            onKeyDown={handleStartKeyDown}
            min={safeFormat(
              currentDateTime,
              "yyyy-MM-dd'T'HH:mm",
              currentDateTime
            )} // Prevent selecting past dates
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
            aria-label="Event Start Time"
          />
          {fieldErrors.start && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {fieldErrors.start}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="event-end"
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium"
          >
            End Time
          </label>
          <input
            type="datetime-local"
            id="event-end"
            ref={endInputRef}
            value={safeFormat(
              newEvent.end,
              "yyyy-MM-dd'T'HH:mm",
              currentDateTime
            )}
            onChange={(e) => {
              const newEnd = new Date(e.target.value);
              if (isDateValid(newEnd)) {
                setNewEvent({ ...newEvent, end: newEnd });
              }
            }}
            onKeyDown={handleEndKeyDown}
            min={
              isDateValid(newEvent.start)
                ? safeFormat(
                    new Date(newEvent.start.getTime() + 60 * 1000),
                    "yyyy-MM-dd'T'HH:mm",
                    currentDateTime
                  )
                : undefined
            } // Ensure end is after start
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
            aria-label="Event End Time"
          />
          {fieldErrors.end && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {fieldErrors.end}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="event-group"
            className="block text-gray-700 dark:text-gray-200 mb-2 font-medium"
          >
            Group
          </label>
          <select
            id="event-group"
            ref={groupSelectRef}
            value={newEvent.groupId}
            onChange={(e) =>
              setNewEvent({ ...newEvent, groupId: e.target.value })
            }
            onKeyDown={handleGroupKeyDown}
            className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gradient-to-r from-blue-500 to-indigo-500 dark:from-gray-500 dark:to-gray-400 focus:scale-[1.01] transition-all duration-300 text-gray-800 dark:text-gray-200"
            aria-label="Select Group"
          >
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
          {fieldErrors.groupId && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {fieldErrors.groupId}
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            ref={createButtonRef}
            onClick={handleCreateEvent}
            onKeyDown={handleCreateButtonKeyDown}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2"
            aria-label="Create Event"
          >
            Create
          </button>
          <button
            ref={cancelButtonRef}
            onClick={() => setShowModal(false)}
            onKeyDown={handleCancelButtonKeyDown}
            className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_5px_rgba(107,114,128,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:ring-offset-2"
            aria-label="Cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
