package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.NotificationResponse;
import com.socialmedia.backend.model.Notification;
import com.socialmedia.backend.model.Post;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final CustomUserDetailsService customUserDetailsService;

    public void createNotification(User actor, User postOwner, Post post, String type) {
        // Don't notify the user if they interacted with their own post
        if (actor.getId().equals(postOwner.getId())) {
            return;
        }

        Notification notification = new Notification();
        notification.setUser(postOwner);
        notification.setActor(actor);
        notification.setPost(post);
        notification.setType(type);
        String action = switch (type) {
            case "LIKE" -> "liked";
            case "COMMENT" -> "commented on";
            case "SHARE" -> "shared";
            default -> "interacted with";
        };
        notification.setMessage(String.format("%s %s your post", actor.getUsername(), action));
        notificationRepository.save(notification);
    }

    public NotificationResponse convertToDTO(Notification notification) {
        NotificationResponse dto = new NotificationResponse();
        dto.setId(notification.getId());
        dto.setActorUsername(notification.getActor().getUsername());
        dto.setActorFullName(notification.getActor().getFullName());
        dto.setActorProfileImage(notification.getActor().getProfileImage());
        dto.setPostId(notification.getPost().getId());
        dto.setType(notification.getType());
        dto.setMessage(notification.getMessage());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setRead(notification.isRead());
        return dto;
    }

    public List<NotificationResponse> getUserNotifications(String token) {
        User user = customUserDetailsService.getUserFromToken(token);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}