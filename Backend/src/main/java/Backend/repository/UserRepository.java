package Backend.repository;

import Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Add this method - findByEmail
    Optional<User> findByEmail(String email);

    // Add this method - existsByEmail
    Boolean existsByEmail(String email);
}