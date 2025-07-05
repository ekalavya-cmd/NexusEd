import React from "react";
import { Calendar } from "react-big-calendar";
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
              style={{ height: 580 }}
              selectable
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
              className="bootstrap-calendar"
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
        </Card.Body>
      </Card>

      {/* Event Details Modal */}
      <EventDetailsModal
        selectedEvent={selectedEvent}
        setSelectedEvent={setSelectedEvent}
        user={user}
        handleDeleteEvent={handleDeleteEvent}
      />

      {/* Create Event Modal */}
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
    </section>
  );
}

export default CalendarPage;
