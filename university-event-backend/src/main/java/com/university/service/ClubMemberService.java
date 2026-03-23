package com.university.service;

import com.university.dto.ClubDTO;
import com.university.dto.ClubJoinRequest;
import java.util.List;

/**
 * Service interface for club membership operations
 */
public interface ClubMemberService {
    void joinClub(Long userId, ClubJoinRequest request);
    void leaveClub(Long userId, Long clubId);
    List<ClubDTO> getJoinedClubs(Long userId);
}
