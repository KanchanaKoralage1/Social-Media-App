package com.socialmedia.backend.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class PostRequest {
    private String content;
    private MultipartFile[] images;
}