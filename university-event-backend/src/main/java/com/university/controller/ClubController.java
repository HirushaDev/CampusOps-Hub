package com.university.controller;

import com.university.dto.ClubDTO;
import com.university.service.ClubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.HashMap;
import java.util.Map;

/**
 * REST API Controller for club operations
 * Endpoints: /api/clubs/**
 */
@RestController
@RequestMapping("/api/clubs")
@CrossOrigin(origins = "http://localhost:3000")
public class ClubController {

    @Autowired
    private ClubService clubService;

    /**
     * GET /api/clubs
     * Get all clubs (Public endpoint)
     */
    @GetMapping
    public ResponseEntity<List<ClubDTO>> getAllClubs() {
        List<ClubDTO> clubs = clubService.getAllClubs();
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }

    /**
     * GET /api/clubs/{id}
     * Get club by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ClubDTO> getClubById(@PathVariable Long id) {
        ClubDTO club = clubService.getClubById(id);
        return new ResponseEntity<>(club, HttpStatus.OK);
    }

    /**
     * POST /api/clubs
     * Create new club (Admin/Organizer only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<ClubDTO> createClub(@Valid @RequestBody ClubDTO clubDTO) {
        ClubDTO createdClub = clubService.createClub(clubDTO);
        return new ResponseEntity<>(createdClub, HttpStatus.CREATED);
    }

    /**
     * PUT /api/clubs/{id}
     * Update club (Admin/Organizer only)
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<ClubDTO> updateClub(@PathVariable Long id, 
                                              @Valid @RequestBody ClubDTO clubDTO) {
        ClubDTO updatedClub = clubService.updateClub(id, clubDTO);
        return new ResponseEntity<>(updatedClub, HttpStatus.OK);
    }

    /**
     * DELETE /api/clubs/{id}
     * Delete club (Admin/Organizer only)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ORGANIZER')")
    public ResponseEntity<Map<String, String>> deleteClub(@PathVariable Long id) {
        clubService.deleteClub(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Club deleted successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET /api/clubs/search
     * Search clubs by name
     */
    @GetMapping("/search")
    public ResponseEntity<List<ClubDTO>> searchClubs(@RequestParam String query) {
        List<ClubDTO> clubs = clubService.searchClubs(query);
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }
}
