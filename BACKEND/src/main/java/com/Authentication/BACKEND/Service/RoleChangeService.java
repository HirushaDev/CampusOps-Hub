package com.Authentication.BACKEND.Service;

import com.Authentication.BACKEND.Entity.Role;
import com.Authentication.BACKEND.Entity.UserEntity;
import com.Authentication.BACKEND.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RoleChangeService {

    private final UserRepository userRepository;

    public void updateUserRole(String userId, Role role) {

        UserEntity user = userRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        //  prevent changing another admin
        if(user.getRole() == Role.ROLE_ADMIN) {
            throw new RuntimeException("Cannot modify admin");
        }

        user.setRole(role);
        userRepository.save(user);
    }
}
