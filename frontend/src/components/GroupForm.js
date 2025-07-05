import React, { forwardRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const GroupForm = forwardRef(
  (
    {
      group,
      setGroup,
      categories,
      groupIcons,
      handleSubmit,
      handleCancel,
      isLoading,
      buttonText = "Create Group",
    },
    ref
  ) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      setGroup((prev) => ({ ...prev, [name]: value }));
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
        e.preventDefault();
        handleSubmit(e);
      }
    };

    return (
      <Form onSubmit={handleSubmit} onKeyDown={handleKeyDown} ref={ref}>
        <Form.Group className="mb-3">
          <Form.Label>
            Group Name<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={group.name}
            onChange={handleChange}
            placeholder="Enter group name"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Description<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="description"
            value={group.description}
            onChange={handleChange}
            placeholder="Describe your study group"
            required
          />
        </Form.Group>

        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={group.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Group Icon</Form.Label>
              <Form.Select
                name="groupImage"
                value={group.groupImage}
                onChange={handleChange}
              >
                {groupIcons.map((icon) => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="btn-hover-shadow"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                {buttonText === "Create Group" ? "Creating..." : "Updating..."}
              </>
            ) : (
              buttonText
            )}
          </Button>
        </div>
      </Form>
    );
  }
);

GroupForm.displayName = "GroupForm";

export default GroupForm;
