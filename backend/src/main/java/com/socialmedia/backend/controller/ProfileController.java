package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.ProfileResponse;
import com.socialmedia.backend.dto.ProfileUpdateRequest;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.service.FileUploadService;
import com.socialmedia.backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileController {

    private final ProfileService profileService;
    private final FileUploadService fileUploadService;

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        // return ResponseEntity.ok(profileService.getProfile(token.replace("Bearer ",
        // "")));

        User user = profileService.getProfile(token.replace("Bearer ", ""));
        ProfileResponse dto = profileService.toProfileResponse(user);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "website", required = false) String website,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "backgroundImage", required = false) MultipartFile backgroundImage,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage) {

        try {
            String cleanToken = token.replace("Bearer ", "");
            ProfileUpdateRequest request = new ProfileUpdateRequest();
            request.setFullName(fullName);
            request.setBio(bio);
            request.setWebsite(website);
            request.setLocation(location);

            // Handle file uploads
            if (backgroundImage != null && !backgroundImage.isEmpty()) {
                String backgroundPath = fileUploadService.saveFile(backgroundImage);
                request.setBackgroundImage(backgroundPath);
            }
            if (profileImage != null && !profileImage.isEmpty()) {
                String profilePath = fileUploadService.saveFile(profileImage);
                request.setProfileImage(profilePath);
            }

            // User updatedUser = profileService.updateProfile(cleanToken, request);
            // return ResponseEntity.ok(updatedUser);

            User updatedUser = profileService.updateProfile(cleanToken, request);
            ProfileResponse dto = profileService.toProfileResponse(updatedUser);
            return ResponseEntity.ok(dto);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getProfileByUsername(
            @PathVariable String username,
            @RequestHeader("Authorization") String token) {
        User user = profileService.getProfileByUsername(username);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        ProfileResponse dto = profileService.toProfileResponse(user);
        return ResponseEntity.ok(dto);
    }

}