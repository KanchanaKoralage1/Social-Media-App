package com.socialmedia.backend.dto;

import lombok.Data;

@Data
public class ProfileResponse {
    private Long id;
    private String username;
    private String fullName;
    private String profileImage;
    private String backgroundImage;
    private String bio;
    private String website;
    private String location;
    private int followersCount; // Added
    private int followingCount; // Added
    private int postsCount; 
    // Add other fields you want to expose
}
