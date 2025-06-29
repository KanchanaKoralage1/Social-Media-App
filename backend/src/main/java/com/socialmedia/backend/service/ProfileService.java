package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.ProfileResponse;
import com.socialmedia.backend.dto.ProfileUpdateRequest;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.UserRepository;
import com.socialmedia.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    public User getProfile(String token) {
        String username = jwtTokenUtil.getUsernameFromToken(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(String token, ProfileUpdateRequest request) {
        String username = jwtTokenUtil.getUsernameFromToken(token);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getFullName() != null)
            user.setFullName(request.getFullName());
        if (request.getBio() != null)
            user.setBio(request.getBio());
        if (request.getWebsite() != null)
            user.setWebsite(request.getWebsite());
        if (request.getLocation() != null)
            user.setLocation(request.getLocation());
        if (request.getProfileImage() != null)
            user.setProfileImage(request.getProfileImage());
        if (request.getBackgroundImage() != null)
            user.setBackgroundImage(request.getBackgroundImage());

        return userRepository.save(user);
    }

    public ProfileResponse toProfileResponse(User user) {
        ProfileResponse dto = new ProfileResponse();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setFullName(user.getFullName());
        dto.setProfileImage(user.getProfileImage());
        dto.setBackgroundImage(user.getBackgroundImage());
        dto.setBio(user.getBio());
        dto.setWebsite(user.getWebsite());
        dto.setLocation(user.getLocation());
        return dto;
    }

    public User getProfileByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

}