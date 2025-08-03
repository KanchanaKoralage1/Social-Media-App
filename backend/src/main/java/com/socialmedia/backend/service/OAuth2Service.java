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

import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Arrays;
import java.util.UUID;

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
                    Arrays.asList(
                            "https://www.googleapis.com/auth/userinfo.email",
                            "https://www.googleapis.com/auth/userinfo.profile",
                            "openid"))
                    .setAccessType("offline")
                    .build();
        }
        return flow;
    }

    public String generateGoogleAuthUrl(HttpSession session) {
        String state = UUID.randomUUID().toString();
        session.setAttribute("oauth_state", state);
        return getFlow().newAuthorizationUrl()
                .setRedirectUri(redirectUri)
                .setAccessType("offline")
                .set("prompt", "select_account consent")
                .setState(state)
                .build();
    }

    public AuthResponse processGoogleCallback(String code, String state, HttpSession session) {
        String storedState = (String) session.getAttribute("oauth_state");
        if (state == null || !state.equals(storedState)) {
            throw new RuntimeException("Invalid state parameter");
        }
        try {
            GoogleTokenResponse tokenResponse = getFlow()
                    .newTokenRequest(code)
                    .setRedirectUri(redirectUri)
                    .execute();

            // Get user info from Google
            String email = tokenResponse.parseIdToken().getPayload().getEmail();
            String name = (String) tokenResponse.parseIdToken().getPayload().get("name");
            String username = (String) tokenResponse.parseIdToken().getPayload().get("given_name");

            // Find or create user
            User user = userRepository.findByEmail(email)
                    .orElseGet(() -> {
                        User newUser = new User();
                        newUser.setEmail(email);
                        String baseUsername = username != null ? username : email.split("@")[0];
                        String uniqueUsername = generateUniqueUsername(baseUsername);
                        newUser.setUsername(uniqueUsername);
                        newUser.setFullName(name != null ? name : "");
                        newUser.setPassword("");
                        return userRepository.save(newUser);
                    });

            // Generate JWT token
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            String token = jwtTokenUtil.generateToken(userDetails);

            // Create response
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setUsername(user.getUsername());
            response.setEmail(user.getEmail());

            return response;
        } catch (IOException e) {
            throw new RuntimeException("Failed to process Google callback: " + e.getMessage(), e);
        }
    }

    private String generateUniqueUsername(String baseUsername) {
        String uniqueUsername = baseUsername;
        int suffix = 1;
        while (userRepository.findByUsername(uniqueUsername).isPresent()) {
            uniqueUsername = baseUsername + suffix;
            suffix++;
        }
        return uniqueUsername;
    }
}