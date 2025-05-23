package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.AuthResponse;
import com.socialmedia.backend.service.OAuth2Service;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;

import java.nio.charset.StandardCharsets;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.net.URLEncoder;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
public class OAuth2Controller {

    private final OAuth2Service oAuth2Service;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/google")
    public ResponseEntity<?> getGoogleAuthUrl() {
        try {
            String authUrl = oAuth2Service.generateGoogleAuthUrl();
            System.out.println("Generated Google Auth URL: " + authUrl);
            return ResponseEntity.ok(authUrl);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to generate Google auth URL: " + e.getMessage());
        }
    }

    @GetMapping("/callback/google")
    public void handleGoogleCallback(@RequestParam String code, HttpServletResponse response) throws IOException {
        try {
            AuthResponse authResponse = oAuth2Service.processGoogleCallback(code);
            
            // Encode the response data as URL hash parameters
            String redirectUrl = String.format("http://localhost:5173/auth/callback#%s",
                URLEncoder.encode(objectMapper.writeValueAsString(authResponse), StandardCharsets.UTF_8.toString()));
            
            response.sendRedirect(redirectUrl);
        } catch (Exception e) {
            response.sendRedirect("http://localhost:5173/login?error=" + 
                URLEncoder.encode("Failed to authenticate with Google", StandardCharsets.UTF_8.toString()));
        }
    }

    
}