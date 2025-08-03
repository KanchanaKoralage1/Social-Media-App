package com.socialmedia.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class SavedPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User user;

    @ManyToOne
    private Post post;
}