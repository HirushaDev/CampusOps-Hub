package com.university.repository;

import com.university.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository for Club entity
 */
@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByNameContainingIgnoreCase(String name);
}
