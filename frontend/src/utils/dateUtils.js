import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";

// Setup date-fns localizer for react-big-calendar
const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
export const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

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
