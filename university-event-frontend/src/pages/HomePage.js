/**
 * Home Page Component
 */

import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const HomePage = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  return (
    <Container className="py-5">
      <div className="text-center">
        <h1 className="display-4 mb-4">🎓 University Event & Club Hub</h1>
        <p className="lead mb-4">
          Your one-stop platform to discover events, join clubs, and connect with the university community
        </p>

        {token ? (
          <div>
            <Button as={Link} to="/student-dashboard" variant="primary" size="lg" className="me-3">
              Go to Dashboard
            </Button>
            <Button as={Link} to="/events" variant="secondary" size="lg" className="me-3">
              Browse Events
            </Button>
            <Button as={Link} to="/clubs" variant="info" size="lg">
              Explore Clubs
            </Button>
          </div>
        ) : (
          <div>
            <Button as={Link} to="/login" variant="primary" size="lg" className="me-3">
              Login
            </Button>
            <Button as={Link} to="/register" variant="success" size="lg">
              Register
            </Button>
          </div>
        )}
      </div>
    </Container>
  );
};

export default HomePage;
