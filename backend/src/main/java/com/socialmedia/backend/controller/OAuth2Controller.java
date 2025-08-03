package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.AuthResponse;
import com.socialmedia.backend.service.OAuth2Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/auth/oauth2")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class OAuth2Controller {

    private final OAuth2Service oAuth2Service;

    @GetMapping("/google")
    public ResponseEntity<?> getGoogleAuthUrl(HttpServletRequest request) {
        try {
            String authUrl = oAuth2Service.generateGoogleAuthUrl(request.getSession());
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
public ResponseEntity<?> handleGoogleCallback(
        @RequestParam("code") String code,
        @RequestParam(value = "state", required = false) String state,
        HttpSession session) {
    try {
        AuthResponse authResponse = oAuth2Service.processGoogleCallback(code, state, session);
        String redirectUrl = null;
        try {
            redirectUrl = String.format(
                    "http://localhost:5173/oauth2/callback?token=%s&username=%s&email=%s",
                    URLEncoder.encode(authResponse.getToken(), StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode(authResponse.getUsername(), StandardCharsets.UTF_8.toString()),
                    URLEncoder.encode(authResponse.getEmail(), StandardCharsets.UTF_8.toString()));
        } catch (Exception e) {
            throw new RuntimeException("Encoding error", e);
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", redirectUrl)
                .build();
    } catch (Exception e) {
        String errorUrl = null;
        try {
            errorUrl = String.format(
                    "http://localhost:5173/oauth2/callback?error=%s",
                    URLEncoder.encode("Failed to authenticate with Google: " + e.getMessage(), StandardCharsets.UTF_8.toString()));
        } catch (Exception encodingError) {
            errorUrl = "http://localhost:5173/oauth2/callback?error=Unknown%20Error";
        }

        return ResponseEntity.status(HttpStatus.FOUND)
                .header("Location", errorUrl)
                .build();
    }
}
}