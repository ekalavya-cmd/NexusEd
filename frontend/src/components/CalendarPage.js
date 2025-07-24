import React from "react";
import Calendar from "react-calendar";
// Import CSS from npm package instead of CDN
import "react-calendar/dist/Calendar.css";
import { Card, Button, Spinner, Alert } from "react-bootstrap";
import useCalendar from "../hooks/useCalendar";
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
    handleCreateEvent,
    handleDeleteEvent,
    handleSelectSlot,
    handleSelectEvent,
    handleNavigate,
  } = useCalendar();

  if (authLoading || isLoading) {
    return (
      <section className="animate-fade-in-up">
        <Card className="shadow-sm border-0" style={{ borderRadius: '20px' }}>
          <Card.Body>
            <div className="calendar-loading">
              <div className="calendar-loading-spinner"></div>
              <p className="calendar-loading-text">Loading your calendar...</p>
            </div>
          </Card.Body>
        </Card>
      </section>
    );
  }

  if (error) {
    return (
      <section className="animate-fade-in-up">
        <Card className="shadow-sm border-0" style={{ borderRadius: '20px' }}>
          <Card.Body>
            <div className="calendar-error">
              <div className="calendar-error-icon">
                <i className="fa-solid fa-exclamation-triangle"></i>
              </div>
              <h4 className="calendar-error-title">Unable to Load Calendar</h4>
              <p className="calendar-error-message">{error}</p>
              <Button 
                variant="primary" 
                className="btn-enhanced"
                onClick={() => window.location.reload()}
                style={{ borderRadius: '25px' }}
              >
                <i className="fa-solid fa-refresh me-2"></i>
                Try Again
              </Button>
            </div>
          </Card.Body>
        </Card>
      </section>
    );
  }

  return (
    <section className="animate-fade-in-up">
      <Card className="shadow-sm border-0" style={{ borderRadius: '20px', overflow: 'hidden' }}>
        <Card.Body className="p-0">
          <div className="custom-toolbar">
            <div className="toolbar-title-section">
              <h2 className="toolbar-title mb-0">
                <i className="fa-solid fa-calendar me-3"></i>
                Event Calendar
              </h2>
              <p className="text-muted mb-0 mt-2">Manage your study events and group meetings</p>
            </div>

            <div className="toolbar-actions">
              {user && (
                <Button
                  variant="primary"
                  className="btn-enhanced"
                  onClick={() => setShowModal(true)}
                  style={{ borderRadius: '25px', fontWeight: '600' }}
                >
                  <i className="fa-solid fa-plus me-2"></i>
                  Create Event
                </Button>
              )}
            </div>
          </div>

          <div className="calendar-container px-4 pb-4">
            <Calendar
              onChange={handleNavigate}
              value={date}
              onClickDay={handleSelectSlot}
              className="react-calendar shadow-hover"
              tileClassName={({ date, view }) => {
                // Add custom classes for events
                const hasEvent = events.some(event => {
                  const eventDate = new Date(event.start);
                  return eventDate.toDateString() === date.toDateString();
                });
                return hasEvent ? 'has-event' : null;
              }}
              tileContent={({ date, view }) => {
                // Show event indicators
                const dayEvents = events.filter(event => {
                  const eventDate = new Date(event.start);
                  return eventDate.toDateString() === date.toDateString();
                });
                return dayEvents.length > 0 ? (
                  <div className="event-indicators">
                    {dayEvents.slice(0, 3).map((event, index) => (
                      <div
                        key={index}
                        className="event-indicator"
                        style={{ backgroundColor: event.color || "#0d6efd" }}
                        title={event.title}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectEvent(event);
                        }}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="event-indicator-more">+{dayEvents.length - 3}</div>
                    )}
                  </div>
                ) : null;
              }}
            />
          </div>
        </Card.Body>
      </Card>

      {/* Floating Action Button for Mobile */}
      {user && (
        <button
          className="create-event-button d-md-none"
          onClick={() => setShowModal(true)}
          aria-label="Create New Event"
        >
          <i className="fa-solid fa-plus"></i>
        </button>
      )}

      {/* Create Event Modal */}
      <div className="create-event-modal">
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
      </div>

      {/* Event Details Modal */}
      <div className="event-details-modal">
        <EventDetailsModal
          show={!!selectedEvent}
          onHide={() => setSelectedEvent(null)}
          event={selectedEvent}
          onDeleteEvent={handleDeleteEvent}
          currentUser={user}
        />
      </div>
    </section>
  );
}

export default CalendarPage;
