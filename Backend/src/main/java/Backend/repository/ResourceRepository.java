package Backend.repository;

import Backend.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByType(String type);
    List<Resource> findByStatus(String status);
    List<Resource> findByIsPopularTrue();

    @Query("SELECT r FROM Resource r WHERE r.name LIKE %:keyword% OR r.location LIKE %:keyword%")
    List<Resource> searchByKeyword(@Param("keyword") String keyword);
}