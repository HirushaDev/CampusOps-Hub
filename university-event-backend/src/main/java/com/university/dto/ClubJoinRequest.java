package com.university.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO for Club Join Request
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubJoinRequest {

    @NotBlank(message = "Club ID is required")
    private Long clubId;
}
