package com.socialmedia.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import lombok.EqualsAndHashCode; 
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String fullName;

    private String bio;

    private String location;

    private String website;

    private String profileImage;

    private String backgroundImage;

    private LocalDateTime birthDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // private boolean verified = false;
    @Column(name = "verified")
    private Boolean verified = false;

    private boolean enabled = true;

    @ManyToMany
    @JoinTable(
        name = "user_following", // Changed to match standard naming
        joinColumns = @JoinColumn(name = "follower_id"),
        inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following")
    @EqualsAndHashCode.Exclude
    private Set<User> followers = new HashSet<>();

    @JsonManagedReference
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public void follow(User userToFollow) {
        this.following.add(userToFollow);
        userToFollow.getFollowers().add(this);
    }

    public void unfollow(User userToUnfollow) {
        this.following.remove(userToUnfollow);
        userToUnfollow.getFollowers().remove(this);
    }

    public boolean isFollowing(User user) {
        return this.following.contains(user);
    }

    public int getFollowersCount() {
        return followers.size();
    }

    public int getFollowingCount() {
        return following.size();
    }

    public int getPostsCount() {
        return posts != null ? posts.size() : 0;
    }
}

