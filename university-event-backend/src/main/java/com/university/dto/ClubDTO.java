package com.university.dto;

import com.university.entity.Club;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Club Information
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubDTO {
    private Long id;
    private String name;
    private String description;

    public static ClubDTO fromClub(Club club) {
        return ClubDTO.builder()
                .id(club.getId())
                .name(club.getName())
                .description(club.getDescription())
                .build();
    }
}
