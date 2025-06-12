package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.CommentResponse;
import com.socialmedia.backend.dto.PostResponse;
import com.socialmedia.backend.model.Like;
import com.socialmedia.backend.model.Post;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.model.Comment;
import com.socialmedia.backend.repository.PostRepository;
import com.socialmedia.backend.repository.LikeRepository;
import com.socialmedia.backend.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
        return convertToDTO(savedPost);
    }

    public List<PostResponse> getUserPosts(Long userId) {
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private PostResponse convertToDTO(Post post) {
        PostResponse dto = new PostResponse();
        dto.setId(post.getId());
        dto.setContent(post.getContent());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        
        PostResponse.UserSummary userSummary = new PostResponse.UserSummary();
        userSummary.setId(post.getUser().getId());
        userSummary.setUsername(post.getUser().getUsername());
        userSummary.setFullName(post.getUser().getFullName());
        userSummary.setProfileImage(post.getUser().getProfileImage());
        userSummary.setVerified(post.getUser().getVerified());
        
        dto.setUser(userSummary);
        return dto;
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

    public PostResponse updatePost(Long postId, String content, String token) {
        User user = customUserDetailsService.getUserFromToken(token);
        Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));
            
        if (!post.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("You can only update your own posts");
        }
        
        post.setContent(content);
        Post updatedPost = postRepository.save(post);
        return convertToDTO(updatedPost);
    }


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

}