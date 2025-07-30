package com.socialmedia.backend.dto;

import lombok.Data;

@Data
public class UserSuggestionDTO {
    private String username;
    private String fullName;
    private String profileImage;
    private Boolean verified;
}