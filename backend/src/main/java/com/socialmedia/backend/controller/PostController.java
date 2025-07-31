package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.CommentResponse;
import com.socialmedia.backend.dto.PostResponse;
import com.socialmedia.backend.service.PostService;
import com.socialmedia.backend.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PostController {
    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestHeader("Authorization") String token,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images) {
        try {
            PostResponse newPost = postService.createPost(
                    token.replace("Bearer ", ""),
                    content,
                    images);
            return ResponseEntity.ok(newPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponse>> getUserPosts(
            @PathVariable Long userId, @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(postService.getUserPosts(userId));
    }

    @GetMapping
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @PutMapping("/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token,
            @RequestParam("content") String content,
            @RequestParam(value = "images", required = false) MultipartFile[] images,
            @RequestParam(value = "keptImages", required = false) String keptImages) {

        try {
            PostResponse updatedPost = postService.updatePost(
                    postId,
                    content,
                    token.replace("Bearer ", ""),
                    images,
                    keptImages);
            return ResponseEntity.ok(updatedPost);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<?> deletePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) {
        try {
            postService.deletePost(postId, token.replace("Bearer ", ""));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) {
        try {
            boolean liked = postService.toggleLike(postId, token.replace("Bearer ", ""));
            return ResponseEntity.ok(Map.of("liked", liked));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponse> addComment(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token,
            @RequestParam("content") String content,
            @RequestParam(value = "image", required = false) MultipartFile image) {
        try {
            CommentResponse comment = postService.addComment(
                    postId,
                    token.replace("Bearer ", ""),
                    content,
                    image);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getComments(postId));
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<CommentResponse> editComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String token,
            @RequestParam("content") String content) {
        try {
            CommentResponse updated = postService.editComment(
                    postId, commentId, token.replace("Bearer ", ""), content);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            @RequestHeader("Authorization") String token) {
        try {
            postService.deleteComment(postId, commentId, token.replace("Bearer ", ""));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{postId}/share")
    public ResponseEntity<?> sharePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) {
        try {
            postService.sharePost(postId, token.replace("Bearer ", ""));
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) {
        try {
            PostResponse post = postService.getPostById(postId, token.replace("Bearer ", ""));
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(403).body(null);
        }
    }

    @PostMapping("/{postId}/save")
    public ResponseEntity<?> savePost(
            @PathVariable Long postId,
            @RequestHeader("Authorization") String token) {
        try {
            boolean saved = postService.toggleSave(postId, token.replace("Bearer ", ""));
            return ResponseEntity.ok(Map.of("saved", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/saved")
    public ResponseEntity<List<PostResponse>> getSavedPosts(
            @RequestHeader("Authorization") String token) {
        try {
            return ResponseEntity.ok(postService.getSavedPosts(token.replace("Bearer ", "")));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}