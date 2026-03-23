package com.university.service;

import com.university.dto.ClubDTO;
import java.util.List;

/**
 * Service interface for club operations
 */
public interface ClubService {
    List<ClubDTO> getAllClubs();
    ClubDTO getClubById(Long id);
    ClubDTO createClub(ClubDTO clubDTO);
    ClubDTO updateClub(Long id, ClubDTO clubDTO);
    void deleteClub(Long id);
    List<ClubDTO> searchClubs(String query);
}
