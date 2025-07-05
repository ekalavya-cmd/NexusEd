import React from "react";
import { Calendar } from "react-big-calendar";
// Import CSS from npm package instead of CDN
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import useCalendar from "../hooks/useCalendar";
import { localizer } from "../utils/dateUtils";
import CustomToolbar from "./CustomToolbar";
import CreateEventModal from "./CreateEventModal";
import EventDetailsModal from "./EventDetailsModal";

// Add custom styles to override React Big Calendar default styles
import "../styles/calendarStyles.css";

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
      <div className="text-center py-5 animate-fade-in-up">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="animate-fade-in-up">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <section className="animate-fade-in-up">
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <Card.Title className="mb-0 fs-4 fw-bold text-primary">
              Event Calendar
            </Card.Title>

            {user && (
              <Button
                variant="primary"
                className="btn-hover-shadow"
                onClick={() => setShowModal(true)}
              >
                <i className="fa-solid fa-plus me-2"></i>
                Create Event
              </Button>
            )}
          </div>

          <div className="calendar-container">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              selectable={!!user}
              popup
              views={["month", "week", "day", "agenda"]}
              step={60}
              showMultiDayTimes
              components={{
                toolbar: CustomToolbar,
              }}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              date={date}
              view={view}
              className="bootstrap-calendar"
              eventPropGetter={(event, start, end, isSelected) => {
                return {
                  className: isSelected ? "selected-event" : "",
                  style: {
                    backgroundColor: event.color || "#0d6efd",
                    borderRadius: "4px",
                    opacity: 0.8,
                    color: "white",
                    border: "0px",
                    display: "block",
                  },
                };
              }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Create Event Modal */}
      <CreateEventModal
        show={showModal}
        onHide={() => setShowModal(false)}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        groups={groups}
        fieldErrors={fieldErrors}
        currentDateTime={currentDateTime}
        onCreateEvent={handleCreateEvent}
      />

      {/* Event Details Modal */}
      <EventDetailsModal
        show={!!selectedEvent}
        onHide={() => setSelectedEvent(null)}
        event={selectedEvent}
        onDeleteEvent={handleDeleteEvent}
        currentUser={user}
      />
    </section>
  );
}

export default CalendarPage;
