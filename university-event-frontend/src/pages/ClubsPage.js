/**
 * Clubs Page Component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Button, Form } from 'react-bootstrap';
import { clubService, clubMemberService } from '../services';
import ClubCard from '../components/ClubCard';

const ClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [joinedClubs, setJoinedClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchClubs();
    if (token) {
      fetchJoinedClubs();
    }
  }, [token]);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      const response = await clubService.getAllClubs();
      setClubs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load clubs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchJoinedClubs = async () => {
    try {
      const response = await clubMemberService.getJoinedClubs();
      setJoinedClubs(response.data.map(c => c.id));
    } catch (err) {
      console.error('Failed to fetch joined clubs');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchClubs();
      return;
    }
    try {
      const response = await clubService.searchClubs(searchQuery);
      setClubs(response.data);
    } catch (err) {
      setError('Search failed. Please try again.');
    }
  };

  const handleJoinClub = async (clubId) => {
    if (!token) {
      alert('Please login to join a club');
      return;
    }

    try {
      if (joinedClubs.includes(clubId)) {
        await clubMemberService.leaveClub(clubId);
        setSuccessMessage('✅ You left the club');
        setJoinedClubs(joinedClubs.filter(id => id !== clubId));
      } else {
        await clubMemberService.joinClub({ clubId });
        setSuccessMessage('✅ You joined the club successfully!');
        setJoinedClubs([...joinedClubs, clubId]);
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join/leave club');
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
      <h1 className="mb-4">🎭 Clubs</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Form onSubmit={handleSearch} className="mb-4">
        <Form.Group className="input-group">
          <Form.Control
            type="text"
            placeholder="Search clubs by name..."
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
                fetchClubs();
              }}
            >
              Clear
            </Button>
          )}
        </Form.Group>
      </Form>

      <Row xs={1} md={2} lg={3} className="g-4">
        {clubs.map((club) => (
          <Col key={club.id}>
            <ClubCard
              club={club}
              onJoin={handleJoinClub}
              isMember={joinedClubs.includes(club.id)}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ClubsPage;
