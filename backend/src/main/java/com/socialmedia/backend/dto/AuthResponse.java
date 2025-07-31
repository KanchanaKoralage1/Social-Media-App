package com.socialmedia.backend.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String fullName; 
  private String profileImage; 
}