package com.Authentication.BACKEND.Controller;

import com.Authentication.BACKEND.Entity.Role;
import com.Authentication.BACKEND.Service.RoleChangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final RoleChangeService roleChangeService;

    @PutMapping("/promote/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public String promoteUser(@PathVariable String userId,
                              @RequestParam Role role) {

        roleChangeService.updateUserRole(userId, role);
        return "User promoted successfully";
    }

}
