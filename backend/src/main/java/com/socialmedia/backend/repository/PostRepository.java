package com.socialmedia.backend.repository;

import com.socialmedia.backend.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Post> findAllByOrderByCreatedAtDesc();

    @Modifying
    @Query("UPDATE Post p SET p.originalPost = NULL WHERE p.originalPost.id = :postId")
    void updateOriginalPostIdToNull(Long postId);
}