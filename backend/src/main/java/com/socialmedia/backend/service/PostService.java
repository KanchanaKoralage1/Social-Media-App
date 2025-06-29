package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.CommentResponse;
import com.socialmedia.backend.dto.PostResponse;
import com.socialmedia.backend.model.*;
import com.socialmedia.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final CustomUserDetailsService customUserDetailsService;
    private final FileUploadService fileUploadService;

    public PostResponse createPost(String token, String content, MultipartFile[] images) {
        User user = customUserDetailsService.getUserFromToken(token);

        Post post = new Post();
        post.setUser(user);
        post.setContent(content);

        if (images != null && images.length > 0) {
            StringBuilder imageUrls = new StringBuilder();
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = fileUploadService.saveFile(image);
                    if (imageUrls.length() > 0) {
                        imageUrls.append(",");
                    }
                    imageUrls.append(imageUrl);
                }
            }
            post.setImageUrl(imageUrls.toString());
        }

        Post savedPost = postRepository.save(post);
        return convertToDTO(savedPost, token);
    }

    public PostResponse getPostById(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return convertToDTO(post, null);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(post -> convertToDTO(post, null))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(post -> convertToDTO(post, null))
                .collect(Collectors.toList());
    }

    private PostResponse convertToDTO(Post post, String token) {
        PostResponse dto = new PostResponse();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        if (post.getImageUrl() != null && !post.getImageUrl().isEmpty()) {
            dto.setImageUrl(post.getImageUrl());
        }
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());

        PostResponse.UserSummary userSummary = new PostResponse.UserSummary();
        userSummary.setId(post.getUser().getId());
        userSummary.setUsername(post.getUser().getUsername());
        userSummary.setFullName(post.getUser().getFullName());
        userSummary.setProfileImage(post.getUser().getProfileImage());
        userSummary.setVerified(post.getUser().getVerified());
        dto.setUser(userSummary);

        // Explicitly fetch comment count
        int commentCount = commentRepository.countByPostId(post.getId());
        dto.setComments(commentCount);

        // Set like count and isLiked
        int likeCount = likeRepository.countByPostId(post.getId());
        dto.setLikes(likeCount);

        boolean isLiked = false;
        if (token != null) {
            User currentUser = customUserDetailsService.getUserFromToken(token);
            isLiked = likeRepository.existsByUserIdAndPostId(currentUser.getId(), post.getId());
        }
        dto.setIsLiked(isLiked);

        dto.setShareCount(post.getShareCount());

        // --- Add this block to always walk up to the root original post ---
    Post root = post.getOriginalPost();
    while (root != null && root.getOriginalPost() != null) {
        root = root.getOriginalPost();
    }
    if (root != null) {
        PostResponse.UserSummary originalUserSummary = new PostResponse.UserSummary();
        originalUserSummary.setId(root.getUser().getId());
        originalUserSummary.setUsername(root.getUser().getUsername());
        originalUserSummary.setFullName(root.getUser().getFullName());
        originalUserSummary.setProfileImage(root.getUser().getProfileImage());
        originalUserSummary.setVerified(root.getUser().getVerified());
        dto.setOriginalUser(originalUserSummary);
        dto.setOriginalContent(root.getContent());
        dto.setOriginalImageUrl(root.getImageUrl());
    }

        return dto;
    }

    @Transactional
    public boolean toggleLike(Long postId, String token) {
        User user = customUserDetailsService.getUserFromToken(token);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        boolean exists = likeRepository.existsByUserIdAndPostId(user.getId(), postId);

        if (exists) {
            likeRepository.deleteByUserIdAndPostId(user.getId(), postId);
            return false;
        } else {
            Like like = new Like();
            like.setUser(user);
            like.setPost(post);
            likeRepository.save(like);
            return true;
        }
    }

    public CommentResponse addComment(Long postId, String token, String content, MultipartFile image) {
        User user = customUserDetailsService.getUserFromToken(token);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(content);

        if (image != null && !image.isEmpty()) {
            String imageUrl = fileUploadService.saveFile(image);
            comment.setImageUrl(imageUrl);
        }

        Comment savedComment = commentRepository.save(comment);
        return convertToCommentDTO(savedComment);
    }

    public List<CommentResponse> getComments(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(this::convertToCommentDTO)
                .collect(Collectors.toList());
    }

    private CommentResponse convertToCommentDTO(Comment comment) {
        CommentResponse dto = new CommentResponse();
        dto.setId(comment.getId());
        dto.setContent(comment.getContent());
        dto.setImageUrl(comment.getImageUrl());
        dto.setCreatedAt(comment.getCreatedAt());

        CommentResponse.UserSummary userSummary = new CommentResponse.UserSummary();
        userSummary.setId(comment.getUser().getId());
        userSummary.setUsername(comment.getUser().getUsername());
        userSummary.setFullName(comment.getUser().getFullName());
        userSummary.setProfileImage(comment.getUser().getProfileImage());
        userSummary.setVerified(comment.getUser().getVerified());
        dto.setUser(userSummary);

        return dto;
    }

    public PostResponse updatePost(Long postId, String content, String token, MultipartFile[] images,
            String keptImages) {
        User user = customUserDetailsService.getUserFromToken(token);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own posts");
        }

        post.setContent(content);

        // Handle keptImages and new images
        StringBuilder imageUrls = new StringBuilder();
        if (keptImages != null && !keptImages.isEmpty()) {
            imageUrls.append(keptImages);
        }
        if (images != null && images.length > 0) {
            for (MultipartFile image : images) {
                if (!image.isEmpty()) {
                    String imageUrl = fileUploadService.saveFile(image);
                    if (imageUrls.length() > 0) {
                        imageUrls.append(",");
                    }
                    imageUrls.append(imageUrl);
                }
            }
        }
        post.setImageUrl(imageUrls.toString());

        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost, token);
    }

    public void deletePost(Long postId, String token) {
        User user = customUserDetailsService.getUserFromToken(token);
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    public CommentResponse editComment(Long postId, Long commentId, String token, String content) {
        User user = customUserDetailsService.getUserFromToken(token);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        if (!comment.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only edit your own comments");
        }
        comment.setContent(content);
        comment.setUpdatedAt(java.time.LocalDateTime.now());
        Comment updated = commentRepository.save(comment);
        return convertToCommentDTO(updated);
    }

    public void deleteComment(Long postId, Long commentId, String token) {
        User user = customUserDetailsService.getUserFromToken(token);
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        Post post = comment.getPost();
        // Allow delete if user is post owner or comment owner
        if (!comment.getUser().getId().equals(user.getId()) && !post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only delete your own comment or comments on your post");
        }
        commentRepository.delete(comment);
    }

    public void sharePost(Long postId, String token) {
        User user = customUserDetailsService.getUserFromToken(token);
        Post original = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // Always find the root post
        Post root = original;
        while (root.getOriginalPost() != null) {
            root = root.getOriginalPost();
        }

        root.setShareCount(root.getShareCount() + 1);
        postRepository.save(root);

        Post shared = new Post();
        shared.setUser(user);
        shared.setContent(""); // or let user add their own caption
        shared.setImageUrl("");
        shared.setOriginalPost(root); // always point to root
        postRepository.save(shared);

    }

}