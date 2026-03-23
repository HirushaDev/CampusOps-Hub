package com.university.service;

import com.university.dto.ClubDTO;
import com.university.entity.Club;
import com.university.exception.ResourceNotFoundException;
import com.university.repository.ClubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Implementation of ClubService for handling club operations
 */
@Service
@Transactional
public class ClubServiceImpl implements ClubService {

    @Autowired
    private ClubRepository clubRepository;

    @Override
    public List<ClubDTO> getAllClubs() {
        return clubRepository.findAll().stream()
                .map(ClubDTO::fromClub)
                .collect(Collectors.toList());
    }

    @Override
    public ClubDTO getClubById(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club", "id", id));
        return ClubDTO.fromClub(club);
    }

    @Override
    public ClubDTO createClub(ClubDTO clubDTO) {
        Club club = Club.builder()
                .name(clubDTO.getName())
                .description(clubDTO.getDescription())
                .build();

        Club savedClub = clubRepository.save(club);
        return ClubDTO.fromClub(savedClub);
    }

    @Override
    public ClubDTO updateClub(Long id, ClubDTO clubDTO) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club", "id", id));

        club.setName(clubDTO.getName());
        club.setDescription(clubDTO.getDescription());

        Club updatedClub = clubRepository.save(club);
        return ClubDTO.fromClub(updatedClub);
    }

    @Override
    public void deleteClub(Long id) {
        Club club = clubRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Club", "id", id));
        clubRepository.delete(club);
    }

    @Override
    public List<ClubDTO> searchClubs(String query) {
        return clubRepository.findByNameContainingIgnoreCase(query).stream()
                .map(ClubDTO::fromClub)
                .collect(Collectors.toList());
    }
}
