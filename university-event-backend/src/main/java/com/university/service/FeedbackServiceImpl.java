package com.university.service;

import com.university.dto.FeedbackRequest;
import com.university.entity.Event;
import com.university.entity.Feedback;
import com.university.entity.User;
import com.university.exception.ResourceNotFoundException;
import com.university.repository.EventRepository;
import com.university.repository.FeedbackRepository;
import com.university.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Implementation of FeedbackService for handling feedback submissions
 */
@Service
@Transactional
public class FeedbackServiceImpl implements FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Override
    public Map<String, Object> submitFeedback(Long userId, FeedbackRequest request) {
        // Get user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        // Get event
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new ResourceNotFoundException("Event", "id", request.getEventId()));

        // Create feedback
        Feedback feedback = Feedback.builder()
                .user(user)
                .event(event)
                .message(request.getMessage())
                .rating(request.getRating())
                .build();

        Feedback savedFeedback = feedbackRepository.save(feedback);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedFeedback.getId());
        response.put("eventId", event.getId());
        response.put("eventName", event.getName());
        response.put("rating", savedFeedback.getRating());
        response.put("message", savedFeedback.getMessage());
        response.put("createdAt", savedFeedback.getCreatedAt());

        return response;
    }

    @Override
    public List<Map<String, Object>> getFeedbackHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        return feedbackRepository.findByUser(user).stream()
                .map(feedback -> {
                    Map<String, Object> feedbackMap = new HashMap<>();
                    feedbackMap.put("id", feedback.getId());
                    feedbackMap.put("eventId", feedback.getEvent().getId());
                    feedbackMap.put("eventName", feedback.getEvent().getName());
                    feedbackMap.put("rating", feedback.getRating());
                    feedbackMap.put("message", feedback.getMessage());
                    feedbackMap.put("createdAt", feedback.getCreatedAt());
                    return feedbackMap;
                })
                .collect(Collectors.toList());
    }
}
