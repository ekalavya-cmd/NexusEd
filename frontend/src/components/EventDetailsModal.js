import React from "react";
import { useNavigate } from "react-router-dom";
import { isDateValid } from "../utils/dateUtils";
import { format } from "date-fns";

const EventDetailsModal = ({
  selectedEvent,
  setSelectedEvent,
  user,
  handleDeleteEvent,
  hideViewGroupButton = false, // Default to false
}) => {
  const navigate = useNavigate();

  if (!selectedEvent) return null;

  // Parse start and end dates to ensure they are Date objects
  const startDate = new Date(selectedEvent.start);
  const endDate = new Date(selectedEvent.end);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-800 dark:text-amber-200 mb-4">
          {selectedEvent.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Start:</strong>{" "}
          {isDateValid(startDate) ? format(startDate, "PPP p") : "Invalid Date"}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>End:</strong>{" "}
          {isDateValid(endDate) ? format(endDate, "PPP p") : "Invalid Date"}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <strong>Description:</strong>{" "}
          {selectedEvent.description || "No description"}
        </p>
        <div className="flex space-x-3">
          {!hideViewGroupButton && (
            <button
              onClick={() =>
                navigate(
                  `/groups/${
                    typeof selectedEvent.group === "string"
                      ? selectedEvent.group
                      : selectedEvent.group?._id
                  }`
                )
              }
              className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-purple-600 dark:to-indigo-600 text-white dark:text-gray-200 px-4 py-2 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(88,28,135,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm flex items-center space-x-1"
              aria-label="View Group"
            >
              <i className="fa-solid fa-users"></i>
              <span>View Group</span>
            </button>
          )}
          {selectedEvent.creator?._id &&
            user?.id &&
            selectedEvent.creator._id === user.id && (
              <button
                onClick={handleDeleteEvent}
                className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 text-white dark:text-gray-200 px-4 py-2 rounded-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(220,38,38,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-600 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
                aria-label="Delete Event"
              >
                Delete
              </button>
            )}
          <button
            onClick={() => setSelectedEvent(null)}
            className="bg-gradient-to-r from-gray-500 to-gray-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-4 py-2 rounded-md hover:shadow-[0_0_10px_rgba(107,114,128,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
            aria-label="Close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
