package com.socialmedia.backend.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String bio;
    private String workAt;
    private String studiedAt;
    private String location;
    private String backgroundImage;
    private String profileImage;
}