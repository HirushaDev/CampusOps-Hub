/**
 * Student Dashboard Page Component
 */

import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const StudentDashboardPage = () => {
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;

  return (
    <Container className="py-5">
      <div className="mb-5">
        <h1>Welcome, {userData?.name}! 👋</h1>
        <p className="text-muted">Explore events, join clubs, and make the most of your university experience</p>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>🎉 Browse Events</Card.Title>
              <Card.Text>
                Discover and book tickets for exciting university events
              </Card.Text>
              <Button as={Link} to="/events" variant="primary" className="w-100">
                View Events
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>🎭 Join Clubs</Card.Title>
              <Card.Text>
                Join clubs that match your interests and hobbies
              </Card.Text>
              <Button as={Link} to="/clubs" variant="primary" className="w-100">
                Browse Clubs
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>📅 My Bookings</Card.Title>
              <Card.Text>
                View and manage your event bookings
              </Card.Text>
              <Button as={Link} to="/my-bookings" variant="primary" className="w-100">
                View Bookings
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>🎯 My Clubs</Card.Title>
              <Card.Text>
                View all clubs you have joined
              </Card.Text>
              <Button as={Link} to="/my-clubs" variant="primary" className="w-100">
                My Clubs
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDashboardPage;
