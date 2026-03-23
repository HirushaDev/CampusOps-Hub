/**
 * My Bookings Page Component
 */

import React, { useState, useEffect } from 'react';
import { Container, Alert, Spinner, Table, Button, Badge } from 'react-bootstrap';
import { bookingService } from '../services';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBookingHistory();
      setBookings(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        setMessage('✅ Booking cancelled successfully!');
        fetchBookings();
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Failed to cancel booking: ' + err.response?.data?.message);
      }
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
      <h1 className="mb-4">📅 My Bookings</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {bookings.length === 0 ? (
        <Alert variant="info">No bookings yet. <a href="/events">Browse events</a></Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Location</th>
              <th>Date</th>
              <th>Status</th>
              <th>Booked On</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.eventName}</td>
                <td>{booking.eventLocation}</td>
                <td>{new Date(booking.eventDate).toLocaleDateString()}</td>
                <td>
                  <Badge bg={booking.status === 'BOOKED' ? 'success' : 'danger'}>
                    {booking.status}
                  </Badge>
                </td>
                <td>{new Date(booking.bookedAt).toLocaleDateString()}</td>
                <td>
                  {booking.status === 'BOOKED' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default MyBookingsPage;
