package com.socialmedia.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

import com.socialmedia.backend.model.Post;

@Data
public class PostResponse {
    private Long id;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserSummary user;
    private Integer comments;
    private Integer likes;
    private Boolean isLiked;
    private Integer shareCount;

    private UserSummary originalUser;
    private String originalContent;
    private String originalImageUrl;
    private Long originalPostId;

    @Data
    public static class UserSummary {
        private Long id;
        private String username;
        private String fullName;
        private String profileImage;
        private Boolean verified;
    }

    public static PostResponse fromPost(Post post, Long currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setImageUrl(post.getImageUrl());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        response.setComments(post.getComments() != null ? post.getComments().size() : 0);
        response.setLikes(post.getLikes().size());
        response.setIsLiked(post.getLikes().stream()
                .anyMatch(like -> like.getUser().getId().equals(currentUserId)));

        response.setShareCount(post.getShareCount());

        UserSummary userSummary = new UserSummary();
        userSummary.setId(post.getUser().getId());
        userSummary.setUsername(post.getUser().getUsername());
        userSummary.setFullName(post.getUser().getFullName());
        userSummary.setProfileImage(post.getUser().getProfileImage());
        userSummary.setVerified(post.getUser().getVerified());
        response.setUser(userSummary);

        // --- THIS IS THE IMPORTANT PART ---
    // Always walk up to the root original post
    Post root = post.getOriginalPost();
    while (root != null && root.getOriginalPost() != null) {
        root = root.getOriginalPost();
    }
    if (root != null) {
        response.setOriginalPostId(root.getId());
        UserSummary originalUserSummary = new UserSummary();
        originalUserSummary.setId(root.getUser().getId());
        originalUserSummary.setUsername(root.getUser().getUsername());
        originalUserSummary.setFullName(root.getUser().getFullName());
        originalUserSummary.setProfileImage(root.getUser().getProfileImage());
        originalUserSummary.setVerified(root.getUser().getVerified());
        response.setOriginalUser(originalUserSummary);
        response.setOriginalContent(root.getContent());
        response.setOriginalImageUrl(root.getImageUrl());
    }
    // --- END IMPORTANT PART ---


        return response;
    }
}