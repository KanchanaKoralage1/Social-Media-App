package com.socialmedia.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MessageResponse {
    private Long id;
    private String senderUsername;
    private String senderFullName;
    private String senderProfileImage;
    private String receiverUsername;
    private String content;
    private LocalDateTime createdAt;
    private boolean isRead;
}