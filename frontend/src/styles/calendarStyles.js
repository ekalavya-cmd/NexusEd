export const calendarStyles = `
  .custom-calendar {
    background: linear-gradient(to bottom right, #eff6ff, #e0e7ff) !important;
    border: 1px solid #bfdbfe !important;
    border-radius: 0.5rem !important;
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1) !important;
  }
  .dark .custom-calendar {
    background: linear-gradient(to bottom right, #374151, #111827) !important;
    border: 1px solid #4b5563 !important;
  }
  .custom-calendar .rbc-header {
    background: linear-gradient(to right, #3b82f6, #2563eb) !important;
    color: white !important;
    font-weight: 600 !important;
    padding: 8px !important;
    border-bottom: 1px solid #3b82f6 !important;
  }
  .dark .custom-calendar .rbc-header {
    background: linear-gradient(to right, #7c3aed, #4f46e5) !important;
    border-bottom: 1px solid #7c3aed !important;
  }
  .custom-calendar .rbc-day-bg {
    background-color: #f9fafb !important;
    border: 1px solid #e5e7eb !important;
    transition: background-color 0.3s ease !important;
  }
  .dark .custom-calendar .rbc-day-bg {
    background-color: #374151 !important;
    border: 1px solid #4b5563 !important;
  }
  .custom-calendar .rbc-day-bg:hover {
    background-color: #e5e7eb !important;
  }
  .dark .custom-calendar .rbc-day-bg:hover {
    background-color: #4b5563 !important;
  }
  .custom-calendar .rbc-today {
    background: linear-gradient(to right, #3b82f6, #2563eb) !important;
    border: 2px solid #1d4ed8 !important;
    border-radius: 4px !important;
    color: white !important;
  }
  .dark .custom-calendar .rbc-today {
    background: linear-gradient(to right, #7c3aed, #4f46e5) !important;
    border: 2px solid #5b21b6 !important;
    color: white !important;
  }
  .custom-calendar .rbc-selected {
    background: #bfdbfe !important;
    border: 2px solid #3b82f6 !important;
    border-radius: 4px !important;
  }
  .dark .custom-calendar .rbc-selected {
    background: #312e81 !important;
    border: 2px solid #6366f1 !important;
  }
  .custom-calendar .rbc-event {
    background: linear-gradient(to right, #7c3aed, #4f46e5) !important;
    color: white !important;
    border: none !important;
    border-radius: 3px !important;
    padding: 2px 4px !important;
    font-size: 0.75rem !important;
    line-height: 1.2 !important;
    min-height: 16px !important;
    transition: transform 0.3s ease, box-shadow 0.3s ease !important;
  }
  .dark .custom-calendar .rbc-event {
    background: linear-gradient(to right, #3b82f6, #2563eb) !important;
  }
  .custom-calendar .rbc-event:hover {
    transform: scale(1.05) !important;
    box-shadow: 0 0 6px rgba(124, 58, 237, 0.5) !important;
  }
  .dark .custom-calendar .rbc-event:hover {
    box-shadow: 0 0 6px rgba(59, 130, 246, 0.5) !important;
  }
  .custom-calendar .rbc-event:focus {
    outline: none !important;
    box-shadow: 0 0 0 2px #7c3aed !important;
  }
  .dark .custom-calendar .rbc-event:focus {
    box-shadow: 0 0 0 2px #3b82f6 !important;
  }
  .custom-calendar .rbc-time-slot {
    background-color: #f9fafb !important;
    border-top: 1px solid #e5e7eb !important;
  }
  .dark .custom-calendar .rbc-time-slot {
    background-color: #374151 !important;
    border-top: 1px solid #4b5563 !important;
  }
  .custom-calendar .rbc-time-header {
    background: linear-gradient(to right, #3b82f6, #2563eb) !important;
    color: white !important;
  }
  .dark .custom-calendar .rbc-time-header {
    background: linear-gradient(to right, #7c3aed, #4f46e5) !important;
  }
  .custom-calendar .rbc-label {
    color: #4b5563 !important;
  }
  .dark .custom-calendar .rbc-label {
    color: #d1d5db !important;
  }
`;
