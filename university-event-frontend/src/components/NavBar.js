/**
 * Navigation Bar Component
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import '../styles/navbar.css';

const NavBar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const userData = user ? JSON.parse(user) : null;

  return (
    <Navbar bg="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🎓 Event & Club Hub
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/events">
              Events
            </Nav.Link>
            <Nav.Link as={Link} to="/clubs">
              Clubs
            </Nav.Link>
            {token && userData?.role === 'STUDENT' && (
              <>
                <Nav.Link as={Link} to="/my-bookings">
                  My Bookings
                </Nav.Link>
                <Nav.Link as={Link} to="/my-clubs">
                  My Clubs
                </Nav.Link>
              </>
            )}
            {token ? (
              <>
                <span className="nav-text me-3" style={{ color: 'white' }}>
                  Hello, {userData?.name}
                </span>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="me-2"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-light"
                  className="me-2"
                >
                  Login
                </Button>
                <Button as={Link} to="/register" variant="light">
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
