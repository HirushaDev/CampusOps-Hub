package Backend.repository;

import Backend.model.Booking;
import Backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByStatus(String status);

    List<Booking> findByStatusOrderByCreatedAtAsc(String status);

    List<Booking> findByStudentEmail(String email);

    // IMPORTANT: Add this method for cascade delete
    List<Booking> findByResource(Resource resource);

    // Also add this method
    void deleteByResource(Resource resource);

    @Query("SELECT b FROM Booking b WHERE b.resource = :resource " +
            "AND b.bookingDate = :date " +
            "AND b.status IN ('APPROVED', 'PENDING') " +
            "AND ((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(@Param("resource") Resource resource,
                                          @Param("date") LocalDate date,
                                          @Param("startTime") LocalTime startTime,
                                          @Param("endTime") LocalTime endTime);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'APPROVED' AND DATE(b.approvedAt) = CURRENT_DATE")
    Long countApprovedToday();
}