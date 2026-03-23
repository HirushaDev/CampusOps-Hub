package com.university.controller;

import com.university.dto.BookingDTO;
import com.university.dto.BookingRequest;
import com.university.security.JwtTokenProvider;
import com.university.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * REST API Controller for booking operations
 * Endpoints: /api/bookings/**
 */
@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Helper method to extract user ID from authentication
     */
    private Long getUserIdFromAuth(Authentication authentication, String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return null;
    }

    /**
     * POST /api/bookings
     * Book an event ticket (Students only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<BookingDTO> bookEvent(@Valid @RequestBody BookingRequest request,
                                                @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(null, authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        BookingDTO booking = bookingService.bookEvent(userId, request);
        return new ResponseEntity<>(booking, HttpStatus.CREATED);
    }

    /**
     * PUT /api/bookings/{id}/cancel
     * Cancel a booking (Students only)
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<BookingDTO> cancelBooking(@PathVariable Long id,
                                                   @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(null, authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        BookingDTO booking = bookingService.cancelBooking(userId, id);
        return new ResponseEntity<>(booking, HttpStatus.OK);
    }

    /**
     * GET /api/bookings/history
     * Get booking history for current user (Students only)
     */
    @GetMapping("/history")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<BookingDTO>> getBookingHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(null, authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<BookingDTO> bookings = bookingService.getBookingHistory(userId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    /**
     * GET /api/bookings/active
     * Get active bookings for current user (Students only)
     */
    @GetMapping("/active")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<BookingDTO>> getActiveBookings(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(null, authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<BookingDTO> bookings = bookingService.getActiveBookings(userId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
}
