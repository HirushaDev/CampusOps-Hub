package com.university.repository;

import com.university.entity.Feedback;
import com.university.entity.User;
import com.university.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Feedback entity
 */
@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByUser(User user);
    List<Feedback> findByEvent(Event event);
    Optional<Feedback> findByUserAndEvent(User user, Event event);
}
