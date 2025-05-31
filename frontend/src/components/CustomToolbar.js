import React from "react";

const CustomToolbar = ({ date, view, onNavigate, onView, label }) => {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={() => onNavigate("TODAY")}
          className="bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_5px_rgba(107,114,128,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)] hover:scale-105 transition-all duration-300"
          aria-label="Go to today"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => onNavigate("PREV")}
          className="bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_5px_rgba(107,114,128,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)] hover:scale-105 transition-all duration-300"
          aria-label="Go to previous period"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => onNavigate("NEXT")}
          className="bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_5px_rgba(107,114,128,0.3)] dark:hover:shadow-[0_0_5px_rgba(209,213,219,0.3)] hover:scale-105 transition-all duration-300"
          aria-label="Go to next period"
        >
          Next
        </button>
      </span>
      <span className="rbc-toolbar-label text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100">
        {label}
      </span>
      <span className="rbc-btn-group">
        <button
          type="button"
          onClick={() => onView("month")}
          className={`${
            view === "month"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600"
              : "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
          } text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_5px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_5px_rgba(21,94,117,0.5)] hover:scale-105 transition-all duration-300`}
          aria-label="Switch to month view"
        >
          Month
        </button>
        <button
          type="button"
          onClick={() => onView("week")}
          className={`${
            view === "week"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600"
              : "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
          } text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_5px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_5px_rgba(21,94,117,0.5)] hover:scale-105 transition-all duration-300`}
          aria-label="Switch to week view"
        >
          Week
        </button>
        <button
          type="button"
          onClick={() => onView("day")}
          className={`${
            view === "day"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600"
              : "bg-gradient-to-r from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700"
          } text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_5px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_5px_rgba(21,94,117,0.5)] hover:scale-105 transition-all duration-300`}
          aria-label="Switch to day view"
        >
          Day
        </button>
      </span>
    </div>
  );
};

export default CustomToolbar;
