package com.university.controller;

import com.university.dto.ClubDTO;
import com.university.dto.ClubJoinRequest;
import com.university.security.JwtTokenProvider;
import com.university.service.ClubMemberService;
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
 * REST API Controller for club member operations
 * Endpoints: /api/clubs/members/**
 */
@RestController
@RequestMapping("/api/clubs/members")
@CrossOrigin(origins = "http://localhost:3000")
public class ClubMemberController {

    @Autowired
    private ClubMemberService clubMemberService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Helper method to extract user ID from authentication
     */
    private Long getUserIdFromAuth(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            return tokenProvider.getUserIdFromToken(token);
        }
        return null;
    }

    /**
     * POST /api/clubs/members/join
     * Join a club (Students only)
     */
    @PostMapping("/join")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<Map<String, String>> joinClub(@Valid @RequestBody ClubJoinRequest request,
                                                        @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        clubMemberService.joinClub(userId, request);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully joined the club");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * DELETE /api/clubs/members/{clubId}
     * Leave a club (Students only)
     */
    @DeleteMapping("/{clubId}")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<Map<String, String>> leaveClub(@PathVariable Long clubId,
                                                         @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        clubMemberService.leaveClub(userId, clubId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Successfully left the club");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * GET /api/clubs/members/my-clubs
     * Get all joined clubs for current user (Students only)
     */
    @GetMapping("/my-clubs")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<ClubDTO>> getJoinedClubs(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<ClubDTO> clubs = clubMemberService.getJoinedClubs(userId);
        return new ResponseEntity<>(clubs, HttpStatus.OK);
    }
}
