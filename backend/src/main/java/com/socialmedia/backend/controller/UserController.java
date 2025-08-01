package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.UserSuggestionDTO;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.UserRepository;
import com.socialmedia.backend.security.JwtTokenUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;

    @GetMapping
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        try {
            String username = jwtTokenUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            System.out.println("Fetching users for: " + username);
            List<UserSuggestionDTO> users = userRepository.findAll().stream()
                    .filter(u -> !u.getUsername().equals(username))
                    .map(u -> {
                        UserSuggestionDTO dto = new UserSuggestionDTO();
                        dto.setUsername(u.getUsername());
                        dto.setFullName(u.getFullName());
                        dto.setProfileImage(u.getProfileImage());
                        dto.setVerified(u.getVerified());
                        return dto;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.out.println("Error fetching users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error fetching users: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String query, @RequestHeader("Authorization") String token) {
        try {
            String currentUsername = jwtTokenUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            System.out.println("Searching users for query: " + query + ", by user: " + currentUsername);
            List<UserSuggestionDTO> users = userRepository.searchUsers(query).stream()
                    .filter(u -> !u.getUsername().equals(currentUsername))
                    .map(u -> {
                        UserSuggestionDTO dto = new UserSuggestionDTO();
                        dto.setUsername(u.getUsername());
                        dto.setFullName(u.getFullName());
                        dto.setProfileImage(u.getProfileImage());
                        dto.setVerified(u.getVerified());
                        return dto;
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.out.println("Error searching users: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error searching users: " + e.getMessage());
        }
    }

    @PostMapping("/{username}/follow")
    @Transactional
    public ResponseEntity<?> followUser(@PathVariable String username, @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Follow request for username: " + username + ", Token: " + token);
            String currentUsername = jwtTokenUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            System.out.println("Current user: " + currentUsername);
            if (currentUsername.equals(username)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You cannot follow yourself.");
            }
            User currentUser = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("Current user not found: " + currentUsername));
            User targetUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Target user not found: " + username));
            System.out.println("Current user found: " + currentUser.getUsername() + ", ID: " + currentUser.getId());
            System.out.println("Target user found: " + targetUser.getUsername() + ", ID: " + targetUser.getId());

            if (!currentUser.isFollowing(targetUser)) {
                currentUser.follow(targetUser); // Use User.follow for consistency
                userRepository.save(currentUser);
                userRepository.save(targetUser);
                System.out.println("Successfully followed " + username);
            } else {
                System.out.println("Already following " + username);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error in followUser: " + e.getMessage());
            e.printStackTrace(); // Log full stack trace for debugging
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error following user: " + e.getMessage());
        }
    }

    @PostMapping("/{username}/unfollow")
    @Transactional
    public ResponseEntity<?> unfollowUser(@PathVariable String username, @RequestHeader("Authorization") String token) {
        try {
            System.out.println("Unfollow request for username: " + username + ", Token: " + token);
            String currentUsername = jwtTokenUtil.getUsernameFromToken(token.replace("Bearer ", ""));
            System.out.println("Current user: " + currentUsername);
            if (currentUsername.equals(username)) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("You cannot unfollow yourself.");
            }
            User currentUser = userRepository.findByUsername(currentUsername)
                    .orElseThrow(() -> new RuntimeException("Current user not found: " + currentUsername));
            User targetUser = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Target user not found: " + username));
            System.out.println("Current user found: " + currentUser.getUsername() + ", ID: " + currentUser.getId());
            System.out.println("Target user found: " + targetUser.getUsername() + ", ID: " + targetUser.getId());

            if (currentUser.isFollowing(targetUser)) {
                currentUser.unfollow(targetUser);
                userRepository.save(currentUser);
                userRepository.save(targetUser);
                System.out.println("Successfully unfollowed " + username);
            } else {
                System.out.println("Not following " + username);
            }
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            System.out.println("Error in unfollowUser: " + e.getMessage());
            e.printStackTrace(); // Log full stack trace for debugging
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error unfollowing user: " + e.getMessage());
        }
    }
}