// filepath: d:\Social Media App\backend\src\main\java\com\socialmedia\backend\service\AuthService.java
package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.AuthResponse;
import com.socialmedia.backend.dto.LoginRequest;
import com.socialmedia.backend.dto.SignupRequest;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.UserRepository;
import com.socialmedia.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;

    public AuthResponse signup(SignupRequest request) {
        // Check if user already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        
        userRepository.save(user);

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
        String token = jwtTokenUtil.generateToken(userDetails);

        // Create response
        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUsername(request.getUsername());
        
        return response;
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword())
        );

        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsernameOrEmail());
        String token = jwtTokenUtil.generateToken(userDetails);

        AuthResponse response = new AuthResponse();
        response.setToken(token);
        response.setUsername(userDetails.getUsername());
        
        return response;
    }
}