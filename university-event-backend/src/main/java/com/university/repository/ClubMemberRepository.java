package com.university.repository;

import com.university.entity.ClubMember;
import com.university.entity.User;
import com.university.entity.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Repository for ClubMember entity
 */
@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember, Long> {
    List<ClubMember> findByUser(User user);
    Optional<ClubMember> findByUserAndClub(User user, Club club);
    List<ClubMember> findByClub(Club club);
    boolean existsByUserAndClub(User user, Club club);
}
