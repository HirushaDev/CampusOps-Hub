package com.university.service;

import com.university.dto.EventDTO;
import java.util.List;

/**
 * Service interface for event operations
 */
public interface EventService {
    List<EventDTO> getAllEvents();
    EventDTO getEventById(Long id);
    EventDTO createEvent(EventDTO eventDTO);
    EventDTO updateEvent(Long id, EventDTO eventDTO);
    void deleteEvent(Long id);
    List<EventDTO> searchEvents(String query);
}
