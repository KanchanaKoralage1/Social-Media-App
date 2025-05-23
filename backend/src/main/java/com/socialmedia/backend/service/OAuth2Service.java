package com.socialmedia.backend.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.socialmedia.backend.dto.AuthResponse;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.UserRepository;
import com.socialmedia.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class OAuth2Service {

    @Value("${spring.security.oauth2.client.registration.google.client-id}")
    private String clientId;

    @Value("${spring.security.oauth2.client.registration.google.client-secret}")
    private String clientSecret;

    @Value("${spring.security.oauth2.client.registration.google.redirect-uri}")
    private String redirectUri;

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    private GoogleAuthorizationCodeFlow flow;

    private GoogleAuthorizationCodeFlow getFlow() {
        if (flow == null) {
            flow = new GoogleAuthorizationCodeFlow.Builder(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                clientId,
                clientSecret,
                Arrays.asList("email", "profile")
            )
            .setAccessType("offline")
            .build();
        }
        return flow;
    }

    public String generateGoogleAuthUrl() {
        return getFlow().newAuthorizationUrl()
            .setRedirectUri(redirectUri)
            .build();
    }

    public AuthResponse processGoogleCallback(String code) {
        try {
            GoogleTokenResponse tokenResponse = getFlow()
                .newTokenRequest(code)
                .setRedirectUri(redirectUri)
                .execute();

            // Get user info from Google
            String email = tokenResponse.parseIdToken().getPayload().getEmail();
            String name = (String) tokenResponse.parseIdToken().getPayload().get("name");

            // Find or create user
            User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setUsername(email.split("@")[0]);
                    newUser.setFullName(name);
                    newUser.setPassword(""); // Google authenticated users don't need password
                    return userRepository.save(newUser);
                });

            // Generate JWT token using UserDetails
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String token = jwtTokenUtil.generateToken(userDetails);

            // Create response
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());

            return response;
        } catch (IOException e) {
            throw new RuntimeException("Failed to process Google callback", e);
        }
    }
}