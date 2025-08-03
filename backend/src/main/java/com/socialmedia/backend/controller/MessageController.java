package com.socialmedia.backend.controller;

import com.socialmedia.backend.dto.ConversationResponse;
import com.socialmedia.backend.dto.MessageResponse;
import com.socialmedia.backend.service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class MessageController {
    private final MessageService messageService;

    @PostMapping("/{receiverUsername}")
    public ResponseEntity<MessageResponse> sendMessage(
            @RequestHeader("Authorization") String token,
            @PathVariable String receiverUsername,
            @RequestParam("content") String content) {
        try {
            MessageResponse message = messageService.sendMessage(
                token.replace("Bearer ", ""), receiverUsername, content);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{otherUsername}")
    public ResponseEntity<List<MessageResponse>> getConversation(
            @RequestHeader("Authorization") String token,
            @PathVariable String otherUsername) {
        try {
            return ResponseEntity.ok(
                messageService.getConversation(token.replace("Bearer ", ""), otherUsername));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationResponse>> getConversations(
            @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        List<ConversationResponse> conversations = messageService.getConversations(jwt);
        return ResponseEntity.ok(conversations);
    }
}