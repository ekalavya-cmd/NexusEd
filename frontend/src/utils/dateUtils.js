import { format } from "date-fns";

// Fallback function to check if a date is valid
export const isDateValid = (date) => {
  return date instanceof Date && !isNaN(date.getTime());
};

// Helper function to format dates safely
export const safeFormat = (date, formatStr, currentDateTime) => {
  if (!isDateValid(date)) {
    // Fallback to currentDateTime if the date is invalid
    return format(currentDateTime, formatStr);
  }
  return format(date, formatStr);
};
