/**
 * Club Card Component
 */

import React from 'react';
import { Card, Button } from 'react-bootstrap';

const ClubCard = ({ club, onJoin, onView, isMember = false }) => {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title>{club.name}</Card.Title>
        <Card.Text>{club.description || 'No description available'}</Card.Text>
        <div className="d-grid gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => onView(club.id)}
          >
            View Details
          </Button>
          {onJoin && (
            <Button
              variant={isMember ? 'danger' : 'success'}
              size="sm"
              onClick={() => onJoin(club.id)}
            >
              {isMember ? 'Leave Club' : 'Join Club'}
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClubCard;
