package com.university.dto;

import com.university.entity.Booking;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for Booking Information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingDTO {
    private Long id;
    private Long eventId;
    private String eventName;
    private String eventLocation;
    private LocalDateTime eventDate;
    private String status;
    private LocalDateTime bookedAt;

    public static BookingDTO fromBooking(Booking booking) {
        return BookingDTO.builder()
                .id(booking.getId())
                .eventId(booking.getEvent().getId())
                .eventName(booking.getEvent().getName())
                .eventLocation(booking.getEvent().getLocation())
                .eventDate(booking.getEvent().getDate())
                .status(booking.getStatus().toString())
                .bookedAt(booking.getCreatedAt())
                .build();
    }
}
