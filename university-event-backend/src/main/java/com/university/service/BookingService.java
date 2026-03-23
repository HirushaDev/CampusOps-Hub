package com.university.service;

import com.university.dto.BookingDTO;
import com.university.dto.BookingRequest;
import java.util.List;

/**
 * Service interface for booking operations
 */
public interface BookingService {
    BookingDTO bookEvent(Long userId, BookingRequest request);
    BookingDTO cancelBooking(Long userId, Long bookingId);
    List<BookingDTO> getBookingHistory(Long userId);
    List<BookingDTO> getActiveBookings(Long userId);
}
