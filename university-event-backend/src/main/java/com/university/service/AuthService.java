package com.university.service;

import com.university.dto.RegisterRequest;
import com.university.dto.LoginRequest;
import com.university.dto.AuthResponse;
import com.university.dto.UserDTO;

/**
 * Service interface for authentication operations
 */
public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    UserDTO getUserInfo(String email);
}
