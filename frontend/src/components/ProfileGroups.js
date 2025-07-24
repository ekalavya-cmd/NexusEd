import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, Button, Badge, Spinner } from "react-bootstrap";
import GroupCard from "./GroupCard";

function ProfileGroups({
  groups,
  isLoading,
  user,
}) {
  const [visibleMembers, setVisibleMembers] = useState({});

  const toggleMembersVisibility = (groupId) => {
    setVisibleMembers(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };
  if (isLoading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-secondary">Loading groups...</p>
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="fas fa-users display-1 text-muted"></i>
        </div>
        <h4 className="mb-3">No Study Groups Yet</h4>
        <p className="text-muted mb-4">
          Join study groups to collaborate with other students and enhance your learning experience.
        </p>
        <Button 
          as={Link} 
          to="/study-groups" 
          variant="primary"
          className="btn-hover-shadow"
        >
          <i className="fas fa-search me-2"></i>
          Browse Groups
        </Button>
      </div>
    );
  }

  return (
    <Row xs={1} md={2} lg={3} className="g-4">
      {groups.map((group, index) => (
        <Col key={group._id}>
          <GroupCard
            group={group}
            user={user}
            visibleMembers={visibleMembers}
            toggleMembersVisibility={toggleMembersVisibility}
            handleEditGroup={() => {}} // Not used in profile view
            handleDeleteConfirmation={() => {}} // Not used in profile view
            handleJoinGroup={() => {}} // Not used in profile view (already a member)
            handleLeaveGroup={() => {}} // Not used in profile view
            deleteConfirmation={null}
            handleDeleteGroup={() => {}} // Not used in profile view
            cancelDeleteGroup={() => {}} // Not used in profile view
            animationDelay={`${index * 0.1}s`}
          />
        </Col>
      ))}
    </Row>
  );
}

export default ProfileGroups;
