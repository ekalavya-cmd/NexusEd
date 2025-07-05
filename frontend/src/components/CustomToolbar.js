import React from "react";
import { Button, ButtonGroup, Row, Col } from "react-bootstrap";
import { format } from "date-fns";

function CustomToolbar({ date, onNavigate, view, onView }) {
  const goToToday = () => {
    onNavigate("TODAY");
  };

  const goToPrev = () => {
    onNavigate("PREV");
  };

  const goToNext = () => {
    onNavigate("NEXT");
  };

  const getNavigationTitle = () => {
    const formattedDate = format(
      date,
      view === "month" ? "MMMM yyyy" : "MMMM d, yyyy"
    );
    return formattedDate;
  };

  return (
    <Row className="align-items-center mb-3">
      <Col xs={12} md={4} className="mb-3 mb-md-0 d-flex">
        <ButtonGroup>
          <Button
            variant="outline-secondary"
            onClick={goToPrev}
            aria-label="Previous"
          >
            <i className="fas fa-chevron-left"></i>
          </Button>
          <Button variant="outline-primary" onClick={goToToday}>
            Today
          </Button>
          <Button
            variant="outline-secondary"
            onClick={goToNext}
            aria-label="Next"
          >
            <i className="fas fa-chevron-right"></i>
          </Button>
        </ButtonGroup>
      </Col>

      <Col xs={12} md={4} className="mb-3 mb-md-0 text-center">
        <h2 className="fs-4 fw-bold text-primary mb-0">
          {getNavigationTitle()}
        </h2>
      </Col>

      <Col xs={12} md={4} className="d-flex justify-content-md-end">
        <ButtonGroup>
          <Button
            variant={view === "month" ? "primary" : "outline-primary"}
            onClick={() => onView("month")}
          >
            Month
          </Button>
          <Button
            variant={view === "week" ? "primary" : "outline-primary"}
            onClick={() => onView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "day" ? "primary" : "outline-primary"}
            onClick={() => onView("day")}
          >
            Day
          </Button>
        </ButtonGroup>
      </Col>
    </Row>
  );
}

export default CustomToolbar;
