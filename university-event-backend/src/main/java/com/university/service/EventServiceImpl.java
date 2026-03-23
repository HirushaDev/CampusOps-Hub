package com.university.service;

import com.university.dto.EventDTO;
import com.university.entity.Event;
import com.university.exception.ResourceNotFoundException;
import com.university.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of EventService for handling event operations
 */
@Service
@Transactional
public class EventServiceImpl implements EventService {

    @Autowired
    private EventRepository eventRepository;

    @Override
    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventDTO::fromEvent)
                .collect(Collectors.toList());
    }

    @Override
    public EventDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        return EventDTO.fromEvent(event);
    }

    @Override
    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = Event.builder()
                .name(eventDTO.getName())
                .description(eventDTO.getDescription())
                .date(eventDTO.getDate())
                .location(eventDTO.getLocation())
                .totalSeats(eventDTO.getTotalSeats())
                .availableSeats(eventDTO.getTotalSeats())
                .build();

        Event savedEvent = eventRepository.save(event);
        return EventDTO.fromEvent(savedEvent);
    }

    @Override
    public EventDTO updateEvent(Long id, EventDTO eventDTO) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));

        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setDate(eventDTO.getDate());
        event.setLocation(eventDTO.getLocation());
        event.setTotalSeats(eventDTO.getTotalSeats());

        Event updatedEvent = eventRepository.save(event);
        return EventDTO.fromEvent(updatedEvent);
    }

    @Override
    public void deleteEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", id));
        eventRepository.delete(event);
    }

    @Override
    public List<EventDTO> searchEvents(String query) {
        return eventRepository.findByNameContainingIgnoreCase(query).stream()
                .map(EventDTO::fromEvent)
                .collect(Collectors.toList());
    }
}
