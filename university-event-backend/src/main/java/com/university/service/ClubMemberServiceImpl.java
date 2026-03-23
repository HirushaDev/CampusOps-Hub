package com.university.service;

import com.university.dto.ClubDTO;
import com.university.dto.ClubJoinRequest;
import com.university.entity.Club;
import com.university.entity.ClubMember;
import com.university.entity.User;
import com.university.exception.DuplicateResourceException;
import com.university.exception.ResourceNotFoundException;
import com.university.repository.ClubMemberRepository;
import com.university.repository.ClubRepository;
import com.university.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ClubMemberService for handling club memberships
 */
@Service
@Transactional
public class ClubMemberServiceImpl implements ClubMemberService {

    @Autowired
    private ClubMemberRepository clubMemberRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClubRepository clubRepository;

    @Override
    public void joinClub(Long userId, ClubJoinRequest request) {
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Get club
        Club club = clubRepository.findById(request.getClubId())
                .orElseThrow(() -> new ResourceNotFoundException("Club", "id", request.getClubId()));

        // Check if already member
        if (clubMemberRepository.existsByUserAndClub(user, club)) {
            throw new DuplicateResourceException("You are already a member of this club");
        }

        // Create club member
        ClubMember clubMember = ClubMember.builder()
                .user(user)
                .club(club)
                .build();

        clubMemberRepository.save(clubMember);
    }

    @Override
    public void leaveClub(Long userId, Long clubId) {
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Get club
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new ResourceNotFoundException("Club", "id", clubId));

        // Get club member
        ClubMember clubMember = clubMemberRepository.findByUserAndClub(user, club)
                .orElseThrow(() -> new ResourceNotFoundException("You are not a member of this club"));

        clubMemberRepository.delete(clubMember);
    }

    @Override
    public List<ClubDTO> getJoinedClubs(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return clubMemberRepository.findByUser(user).stream()
                .map(clubMember -> ClubDTO.fromClub(clubMember.getClub()))
                .collect(Collectors.toList());
    }
}
