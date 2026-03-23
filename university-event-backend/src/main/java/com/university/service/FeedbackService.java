package com.university.service;

import com.university.dto.FeedbackRequest;
import java.util.List;
import java.util.Map;

/**
 * Service interface for feedback operations
 */
public interface FeedbackService {
    Map<String, Object> submitFeedback(Long userId, FeedbackRequest request);
    List<Map<String, Object>> getFeedbackHistory(Long userId);
}
