/**
 * Events Page Component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button, Modal, Form } from 'react-bootstrap';
import { eventService, bookingService } from '../services';
import EventCard from '../components/EventCard';

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getAllEvents();
      setEvents(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load events. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchEvents();
      return;
    }
    try {
      const response = await eventService.searchEvents(searchQuery);
      setEvents(response.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  };

  const handleBookEvent = (eventId) => {
    if (!token) {
      alert('Please login to book an event');
      return;
    }
    setSelectedEventId(eventId);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    try {
      await bookingService.bookEvent({ eventId: selectedEventId });
      setBookingMessage('✅ Event booked successfully!');
      setShowBookingModal(false);
      setTimeout(() => setBookingMessage(''), 3000);
      fetchEvents();
    } catch (err) {
      setBookingMessage('❌ Failed to book event: ' + err.response?.data?.message);
    }
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">🎉 Events</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {bookingMessage && (
        <Alert variant={bookingMessage.includes('✅') ? 'success' : 'danger'}>
          {bookingMessage}
        </Alert>
      )}

      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="input-group">
          <Form.Control
            type="text"
            placeholder="Search events by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button variant="primary" type="submit">
            Search
          </Button>
          {searchQuery && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                fetchEvents();
              }}
            >
              Clear
            </Button>
          )}
        </Form.Group>
      </Form>

      <Row xs={1} md={2} lg={3} className="g-4">
        {events.map((event) => (
          <Col key={event.id}>
            <EventCard
              event={event}
              onBook={handleBookEvent}
            />
          </Col>
        ))}
      </Row>

      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to book this event?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmBooking}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EventsPage;
