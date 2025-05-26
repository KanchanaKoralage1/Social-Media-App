package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.PostResponse;
import com.socialmedia.backend.model.Post;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
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
}