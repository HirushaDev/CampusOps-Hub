package com.university.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for Feedback Submission
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackRequest {

    @NotBlank(message = "Event ID is required")
    private Long eventId;

    @NotBlank(message = "Feedback message is required")
    private String message;

    @Min(value = 1, message = "Rating must be at least 1")
    private Integer rating;
}
