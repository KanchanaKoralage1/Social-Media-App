package com.socialmedia.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String bio;
    private String website;
    private String location;
    private String backgroundImage;
    private String profileImage;
}