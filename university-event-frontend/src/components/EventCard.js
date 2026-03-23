/**
 * Event Card Component
 */

import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, onBook, onView }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{event.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {event.location}
        </Card.Subtitle>
        <Card.Text>{event.description?.substring(0, 100)}...</Card.Text>
        <div className="mb-3">
          <small className="text-muted d-block">
            📅 {new Date(event.date).toLocaleDateString()}
          </small>
          <small className="text-muted d-block">
            👥 Available Seats: {event.availableSeats}/{event.totalSeats}
          </small>
        </div>
        <div className="d-grid gap-2">
          <Button variant="primary" size="sm" onClick={handleViewDetails}>
            View Details
          </Button>
          {onBook && (
            <Button variant="success" size="sm" onClick={() => onBook(event.id)}>
              Book Event
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default EventCard;
