/**
 * My Clubs Page Component
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { clubMemberService } from '../services';
import ClubCard from '../components/ClubCard';

const MyClubsPage = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchJoinedClubs();
  }, []);

  const fetchJoinedClubs = async () => {
    try {
      setLoading(true);
      const response = await clubMemberService.getJoinedClubs();
      setClubs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load joined clubs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveClub = async (clubId) => {
    if (window.confirm('Are you sure you want to leave this club?')) {
      try {
        await clubMemberService.leaveClub(clubId);
        setMessage('✅ You left the club successfully!');
        setClubs(clubs.filter(c => c.id !== clubId));
        setTimeout(() => setMessage(''), 3000);
      } catch (err) {
        setError('Failed to leave club: ' + err.response?.data?.message);
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
      <h1 className="mb-4">🎭 My Clubs</h1>

      {error && <Alert variant="danger">{error}</Alert>}
      {message && <Alert variant="success">{message}</Alert>}

      {clubs.length === 0 ? (
        <Alert variant="info">You haven't joined any clubs yet. <a href="/clubs">Join a club</a></Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {clubs.map((club) => (
            <Col key={club.id}>
              <ClubCard
                club={club}
                onJoin={handleLeaveClub}
                isMember={true}
              />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyClubsPage;
