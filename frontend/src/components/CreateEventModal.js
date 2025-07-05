import React from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { format } from "date-fns";

function CreateEventModal({
  showModal,
  setShowModal,
  newEvent,
  setNewEvent,
  currentDateTime,
  groups,
  fieldErrors,
  handleCreateEvent,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  return (
    <Modal
      show={showModal}
      onHide={() => setShowModal(false)}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-calendar-plus me-2 text-primary"></i>
          Create New Event
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={(e) => e.preventDefault()}>
          <Form.Group className="mb-3">
            <Form.Label>
              Event Title<span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={newEvent.title}
              onChange={handleChange}
              placeholder="Enter event title"
              isInvalid={fieldErrors.title}
            />
            {fieldErrors.title && (
              <Form.Control.Feedback type="invalid">
                {fieldErrors.title}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={newEvent.description}
              onChange={handleChange}
              placeholder="Enter event description"
              isInvalid={fieldErrors.description}
            />
            {fieldErrors.description && (
              <Form.Control.Feedback type="invalid">
                {fieldErrors.description}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  Start Date & Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="start"
                  value={newEvent.start}
                  onChange={handleChange}
                  min={format(currentDateTime, "yyyy-MM-dd'T'HH:mm")}
                  isInvalid={fieldErrors.start}
                />
                {fieldErrors.start && (
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.start}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label>
                  End Date & Time<span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  type="datetime-local"
                  name="end"
                  value={newEvent.end}
                  onChange={handleChange}
                  min={newEvent.start}
                  isInvalid={fieldErrors.end}
                />
                {fieldErrors.end && (
                  <Form.Control.Feedback type="invalid">
                    {fieldErrors.end}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={newEvent.location}
              onChange={handleChange}
              placeholder="Enter event location (optional)"
              isInvalid={fieldErrors.location}
            />
            {fieldErrors.location && (
              <Form.Control.Feedback type="invalid">
                {fieldErrors.location}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>
              Study Group<span className="text-danger">*</span>
            </Form.Label>
            <Form.Select
              name="studyGroup"
              value={newEvent.studyGroup}
              onChange={handleChange}
              isInvalid={fieldErrors.studyGroup}
            >
              <option value="">Select a study group</option>
              {groups.map((group) => (
                <option key={group._id} value={group._id}>
                  {group.name}
                </option>
              ))}
            </Form.Select>
            {fieldErrors.studyGroup && (
              <Form.Control.Feedback type="invalid">
                {fieldErrors.studyGroup}
              </Form.Control.Feedback>
            )}
          </Form.Group>

          {Object.keys(fieldErrors).length > 0 && (
            <Alert variant="danger" className="mb-3">
              <i className="fas fa-exclamation-circle me-2"></i>
              Please fix the errors before submitting the form.
            </Alert>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          variant="primary"
          className="btn-hover-shadow"
          onClick={handleCreateEvent}
        >
          <i className="fas fa-calendar-check me-2"></i>
          Create Event
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CreateEventModal;
