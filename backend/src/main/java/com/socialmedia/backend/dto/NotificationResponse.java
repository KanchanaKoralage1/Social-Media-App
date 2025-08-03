package com.socialmedia.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponse {
    private Long id;
    private String actorUsername;
    private String actorFullName;
    private String actorProfileImage;
    private Long postId;
    private String type;
    private String message;
    private LocalDateTime createdAt;
    private boolean isRead;
}