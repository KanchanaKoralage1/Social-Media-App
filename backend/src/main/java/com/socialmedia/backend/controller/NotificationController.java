package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.NotificationResponse;
import com.socialmedia.backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {
    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getNotifications(
            @RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(notificationService.getUserNotifications(token.replace("Bearer ", "")));
    }
}