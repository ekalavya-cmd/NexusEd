import React from "react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";
import { format } from "date-fns";
import { Link } from "react-router-dom";

function EventDetailsModal({
  selectedEvent,
  setSelectedEvent,
  user,
  handleDeleteEvent,
  hideViewGroupButton = false,
}) {
  if (!selectedEvent) return null;

  const formatDate = (date) => {
    return format(new Date(date), "PPPP");
  };

  const formatTime = (date) => {
    return format(new Date(date), "p");
  };

  const isCreator =
    user && selectedEvent.creator && user.id === selectedEvent.creator._id;

  return (
    <Modal
      show={!!selectedEvent}
      onHide={() => setSelectedEvent(null)}
      centered
      size="lg"
    >
      <Modal.Header closeButton className="bg-light">
        <Modal.Title>
          <i className="fas fa-calendar-day me-2 text-primary"></i>
          {selectedEvent.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row className="mb-4">
          <Col xs={12} md={6} className="mb-3 mb-md-0">
            <h5 className="mb-2 text-secondary">
              <i className="fas fa-clock me-2"></i>
              Time
            </h5>
            <div className="ps-4">
              <p className="mb-1">
                <strong>Starts:</strong> {formatDate(selectedEvent.start)} at{" "}
                {formatTime(selectedEvent.start)}
              </p>
              <p className="mb-0">
                <strong>Ends:</strong> {formatDate(selectedEvent.end)} at{" "}
                {formatTime(selectedEvent.end)}
              </p>
            </div>
          </Col>

          <Col xs={12} md={6}>
            <h5 className="mb-2 text-secondary">
              <i className="fas fa-user me-2"></i>
              Organizer
            </h5>
            <div className="ps-4">
              <p className="mb-0">
                {selectedEvent.creator
                  ? selectedEvent.creator.username
                  : "Unknown"}
              </p>
            </div>
          </Col>
        </Row>

        {selectedEvent.location && (
          <div className="mb-4">
            <h5 className="mb-2 text-secondary">
              <i className="fas fa-map-marker-alt me-2"></i>
              Location
            </h5>
            <div className="ps-4">
              <p className="mb-0">{selectedEvent.location}</p>
            </div>
          </div>
        )}

        {selectedEvent.description && (
          <div className="mb-4">
            <h5 className="mb-2 text-secondary">
              <i className="fas fa-info-circle me-2"></i>
              Description
            </h5>
            <div className="ps-4">
              <p className="mb-0">{selectedEvent.description}</p>
            </div>
          </div>
        )}

        <div className="mb-2">
          <h5 className="mb-2 text-secondary">
            <i className="fas fa-users me-2"></i>
            Study Group
          </h5>
          <div className="ps-4">
            {selectedEvent.studyGroup ? (
              <Badge
                bg="primary"
                as={Link}
                to={`/groups/${selectedEvent.studyGroup._id}`}
                style={{ textDecoration: "none" }}
                className="fs-6"
              >
                {selectedEvent.studyGroup.name}
              </Badge>
            ) : (
              <p className="mb-0">No group associated</p>
            )}
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        {!hideViewGroupButton && selectedEvent.studyGroup && (
          <Button
            as={Link}
            to={`/groups/${selectedEvent.studyGroup._id}`}
            variant="outline-primary"
            onClick={() => setSelectedEvent(null)}
          >
            <i className="fas fa-users me-2"></i>
            View Group
          </Button>
        )}

        <Button variant="secondary" onClick={() => setSelectedEvent(null)}>
          Close
        </Button>

        {isCreator && (
          <Button
            variant="danger"
            onClick={() => {
              handleDeleteEvent(selectedEvent._id);
              setSelectedEvent(null);
            }}
          >
            <i className="fas fa-trash me-2"></i>
            Delete Event
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default EventDetailsModal;
