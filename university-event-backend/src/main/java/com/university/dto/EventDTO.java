package com.university.dto;

import com.university.entity.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

/**
 * DTO for Event Information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventDTO {
    private Long id;
    private String name;
    private String description;
    private LocalDateTime date;
    private String location;
    private Integer totalSeats;
    private Integer availableSeats;

    public static EventDTO fromEvent(Event event) {
        return EventDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .date(event.getDate())
                .location(event.getLocation())
                .totalSeats(event.getTotalSeats())
                .availableSeats(event.getAvailableSeats())
                .build();
    }
}
