package com.university.service;

import com.university.dto.BookingDTO;
import com.university.dto.BookingRequest;
import com.university.entity.Booking;
import com.university.entity.Event;
import com.university.entity.User;
import com.university.exception.DuplicateResourceException;
import com.university.exception.ResourceNotFoundException;
import com.university.repository.BookingRepository;
import com.university.repository.EventRepository;
import com.university.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of BookingService for handling event bookings
 */
@Service
@Transactional
public class BookingServiceImpl implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public BookingDTO bookEvent(Long userId, BookingRequest request) {
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Get event
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getEventId()));

        // Check if already booked
        if (bookingRepository.findByUserAndEvent(user, event).isPresent()) {
            throw new DuplicateResourceException("You have already booked this event");
        }

        // Check if seats available
        if (event.getAvailableSeats() <= 0) {
            throw new ResourceNotFoundException("No available seats for this event");
        }

        // Create booking
        Booking booking = Booking.builder()
                .user(user)
                .event(event)
                .status(Booking.BookingStatus.BOOKED)
                .build();

        // Decrease available seats
        event.setAvailableSeats(event.getAvailableSeats() - 1);
        eventRepository.save(event);

        Booking savedBooking = bookingRepository.save(booking);
        return BookingDTO.fromBooking(savedBooking);
    }

    @Override
    public BookingDTO cancelBooking(Long userId, Long bookingId) {
        // Get booking
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking", "id", bookingId));

        // Verify ownership
        if (!booking.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Booking not found for this user");
        }

        // Check if already cancelled
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new ResourceNotFoundException("Booking is already cancelled");
        }

        // Cancel booking
        booking.setStatus(Booking.BookingStatus.CANCELLED);

        // Increase available seats
        Event event = booking.getEvent();
        event.setAvailableSeats(event.getAvailableSeats() + 1);
        eventRepository.save(event);

        Booking updatedBooking = bookingRepository.save(booking);
        return BookingDTO.fromBooking(updatedBooking);
    }

    @Override
    public List<BookingDTO> getBookingHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return bookingRepository.findByUser(user).stream()
                .map(BookingDTO::fromBooking)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingDTO> getActiveBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return bookingRepository.findByUserAndStatusOrderByCreatedAtDesc(user, Booking.BookingStatus.BOOKED)
                .stream()
                .map(BookingDTO::fromBooking)
                .collect(Collectors.toList());
    }
}
