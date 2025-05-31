import React, { useRef, useImperativeHandle, forwardRef } from "react";

// Use forwardRef to allow the parent component to access the undo button ref
const ConfirmationMessage = forwardRef(
  ({ error, success, confirmation, clearConfirmation }, ref) => {
    const undoButtonRef = useRef(null);

    // Expose the undoButtonRef to the parent via the ref prop
    useImperativeHandle(ref, () => ({
      focusUndoButton: () => {
        if (undoButtonRef.current) {
          undoButtonRef.current.focus();
        }
      },
    }));

    return (
      <>
        {error && (
          <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/70 text-green-700 dark:text-green-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-700 shadow-md hover:shadow-[0_0_10px_rgba(34,197,94,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up">
            {success}
          </div>
        )}
        {confirmation && (
          <div
            id="confirmation-message"
            className="bg-yellow-100 dark:bg-yellow-900/70 text-yellow-700 dark:text-yellow-300 p-4 mb-6 rounded-lg border border-gradient-to-r from-yellow-200 to-yellow-300 dark:from-yellow-800 dark:to-yellow-700 shadow-md hover:shadow-[0_0_10px_rgba(234,179,8,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up flex justify-between items-center"
          >
            <span>{confirmation.message}</span>
            <button
              ref={undoButtonRef}
              onClick={() => {
                confirmation.undo();
                clearConfirmation();
              }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-600 dark:to-gray-500 text-white dark:text-gray-200 px-3 py-1 rounded-md hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-gray-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 text-sm"
              aria-label="Undo Action"
            >
              Undo
            </button>
          </div>
        )}
      </>
    );
  }
);

export default ConfirmationMessage;
