package com.university.repository;

import com.university.entity.Booking;
import com.university.entity.User;
import com.university.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for Booking entity
 */
@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    Optional<Booking> findByUserAndEvent(User user, Event event);
    List<Booking> findByUserAndStatusOrderByCreatedAtDesc(User user, Booking.BookingStatus status);
}
