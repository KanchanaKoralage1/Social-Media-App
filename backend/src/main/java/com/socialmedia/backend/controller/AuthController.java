package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.AuthResponse;
import com.socialmedia.backend.dto.LoginRequest;
import com.socialmedia.backend.dto.SignupRequest;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.UserRepository;
import com.socialmedia.backend.security.JwtTokenUtil;
import com.socialmedia.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserDetails(@RequestHeader("Authorization") String token) {
        String username = jwtTokenUtil.getUsernameFromToken(token.replace("Bearer ", ""));
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, String> response = new HashMap<>();
        response.put("email", user.getEmail());
        response.put("username", user.getUsername());
        
        return ResponseEntity.ok(response);
    }
}