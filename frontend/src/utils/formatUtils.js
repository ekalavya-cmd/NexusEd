import { useRef } from "react";

export const formatDateTime = (date) => {
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

export const useTemporaryMessage = () => {
  const timeoutRef = useRef(null);
  const uploadTimeoutRef = useRef(null);

  const setTemporaryMessage = (setError, setSuccess, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setError(message);
    setSuccess("");
    timeoutRef.current = setTimeout(() => {
      setError("");
      setSuccess("");
      timeoutRef.current = null;
    }, 3000);
  };

  const setTemporarySuccess = (setError, setSuccess, message) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setSuccess(message);
    setError("");
    timeoutRef.current = setTimeout(() => {
      setError("");
      setSuccess("");
      timeoutRef.current = null;
    }, 3000);
  };

  const setTemporaryUploadError = (setUploadError, message) => {
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
    }
    setUploadError(message);
    uploadTimeoutRef.current = setTimeout(() => {
      setUploadError("");
      uploadTimeoutRef.current = null;
    }, 3000);
  };

  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (uploadTimeoutRef.current) {
      clearTimeout(uploadTimeoutRef.current);
    }
  };

  return {
    setTemporaryMessage,
    setTemporarySuccess,
    setTemporaryUploadError,
    cleanup,
  };
};
