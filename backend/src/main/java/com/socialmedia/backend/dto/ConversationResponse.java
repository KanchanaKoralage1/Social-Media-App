package com.socialmedia.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationResponse {
    private Long otherUserId;
    private String otherUsername;
    private String otherUserFullName;
    private String otherUserProfileImage;
    private String lastMessageContent;
    private LocalDateTime lastMessageCreatedAt;
    private boolean lastMessageRead;
}