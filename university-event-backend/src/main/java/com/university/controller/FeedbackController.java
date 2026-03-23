package com.university.controller;

import com.university.dto.FeedbackRequest;
import com.university.security.JwtTokenProvider;
import com.university.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * REST API Controller for feedback operations
 * Endpoints: /api/feedback/**
 */
@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "http://localhost:3000")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

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
     * POST /api/feedback
     * Submit feedback for an event (Students only)
     */
    @PostMapping
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<Map<String, Object>> submitFeedback(@Valid @RequestBody FeedbackRequest request,
                                                              @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        Map<String, Object> feedback = feedbackService.submitFeedback(userId, request);
        return new ResponseEntity<>(feedback, HttpStatus.CREATED);
    }

    /**
     * GET /api/feedback/history
     * Get feedback history for current user (Students only)
     */
    @GetMapping("/history")
    @PreAuthorize("hasAuthority('STUDENT')")
    public ResponseEntity<List<Map<String, Object>>> getFeedbackHistory(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = getUserIdFromAuth(authHeader);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        List<Map<String, Object>> feedbackList = feedbackService.getFeedbackHistory(userId);
        return new ResponseEntity<>(feedbackList, HttpStatus.OK);
    }
}
