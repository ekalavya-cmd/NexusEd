import React, { useEffect, useRef } from "react";
import { Alert } from "react-bootstrap";

function ConfirmationMessage({ message, type, onClose }) {
  const alertRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (alertRef.current) {
        alertRef.current.style.opacity = 0;
      }
      setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, 300);
    }, 2700);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <Alert
      ref={alertRef}
      variant={type === "error" ? "danger" : "success"}
      className="message position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg"
      style={{
        zIndex: 1050,
        maxWidth: "90%",
        width: "auto",
        transition: "opacity 0.3s ease-in-out",
      }}
    >
      <div className="d-flex align-items-center">
        <i
          className={`fas ${
            type === "error" ? "fa-exclamation-circle" : "fa-check-circle"
          } me-2`}
        ></i>
        {message}
      </div>
    </Alert>
  );
}

export default ConfirmationMessage;
