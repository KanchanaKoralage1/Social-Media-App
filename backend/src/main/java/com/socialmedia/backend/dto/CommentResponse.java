package com.socialmedia.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private UserSummary user;
    
    @Data
    public static class UserSummary {
        private Long id;
        private String username;
        private String fullName;
        private String profileImage;
        private Boolean verified;
    }
}