import React from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useCalendar from "../hooks/useCalendar";
import { localizer } from "../utils/dateUtils";
import CustomToolbar from "./CustomToolbar";
import CreateEventModal from "./CreateEventModal";
import EventDetailsModal from "./EventDetailsModal";
import { calendarStyles } from "../styles/calendarStyles";

function CalendarPage() {
  const {
    user,
    authLoading,
    events,
    isLoading,
    error,
    showModal,
    setShowModal,
    newEvent,
    setNewEvent,
    groups,
    selectedEvent,
    setSelectedEvent,
    fieldErrors,
    currentDateTime,
    date,
    view,
    handleCreateEvent,
    handleDeleteEvent,
    handleSelectSlot,
    handleSelectEvent,
    handleNavigate,
    handleViewChange,
  } = useCalendar();

  if (authLoading || isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up flex flex-col items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-gradient-to-r from-blue-600 to-indigo-600 dark:from-gray-500 dark:to-gray-400"></div>
        <p className="text-gray-600 dark:text-gray-400 mt-3 text-lg animate-pulse">
          Loading calendar...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 dark:bg-red-900/70 text-red-700 dark:text-red-300 p-4 mt-10 rounded-lg border border-gradient-to-r from-red-200 to-red-300 dark:from-red-800 dark:to-red-700 shadow-md hover:shadow-[0_0_10px_rgba(239,68,68,0.5)] dark:hover:shadow-[0_0_10px_rgba(209,213,219,0.5)] transition-all duration-300 animate-fade-in-up">
        {error}
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-10">
      <style>{calendarStyles}</style>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-xl shadow-xl border border-blue-100 dark:border-gray-600 hover:shadow-2xl dark:hover:shadow-[0_0_15px_rgba(209,213,219,0.3)] hover:-translate-y-2 transition-all duration-300 animate-fade-in-up">
            <h1 className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-amber-200 dark:to-amber-100 mb-6 hover-underline">
              Study Calendar
            </h1>
            <button
              onClick={() => setShowModal(true)}
              className="mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-cyan-600 dark:to-teal-600 text-white dark:text-gray-200 px-5 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:hover:shadow-[0_0_10px_rgba(21,94,117,0.5)] dark:hover:dark-glow hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex items-center space-x-1"
              aria-label="Create New Event"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Create Event</span>
            </button>
            <div className="calendar-container">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                selectable
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                className="custom-calendar"
                date={date}
                onNavigate={handleNavigate}
                view={view}
                onView={handleViewChange}
                views={["month", "week", "day"]}
                components={{
                  toolbar: CustomToolbar,
                }}
              />
            </div>
          </div>

          <EventDetailsModal
            selectedEvent={selectedEvent}
            setSelectedEvent={setSelectedEvent}
            user={user}
            handleDeleteEvent={handleDeleteEvent}
          />

          <CreateEventModal
            showModal={showModal}
            setShowModal={setShowModal}
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            currentDateTime={currentDateTime}
            groups={groups}
            fieldErrors={fieldErrors}
            handleCreateEvent={handleCreateEvent}
          />
        </div>
      </div>
    </section>
  );
}

export default CalendarPage;
