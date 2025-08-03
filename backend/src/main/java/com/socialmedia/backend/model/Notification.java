package com.socialmedia.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // The user receiving the notification (post owner)

    @ManyToOne
    @JoinColumn(name = "actor_id", nullable = false)
    private User actor; // The user performing the action (liker, commenter, sharer)

    @ManyToOne
    @JoinColumn(name = "post_id")
    private Post post; // The post related to the notification

    @Column(nullable = false)
    private String type; // e.g., "LIKE", "COMMENT", "SHARE"

    @Column(columnDefinition = "TEXT")
    private String message; // e.g., "kanchana liked your post"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_read")
    private boolean isRead = false;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}