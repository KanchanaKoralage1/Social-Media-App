package com.socialmedia.backend.service;

import com.socialmedia.backend.dto.MessageResponse;
import com.socialmedia.backend.dto.ConversationResponse;
import com.socialmedia.backend.model.Message;
import com.socialmedia.backend.model.User;
import com.socialmedia.backend.repository.MessageRepository;
import com.socialmedia.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final CustomUserDetailsService customUserDetailsService;

    public MessageResponse sendMessage(String token, String receiverUsername, String content) {
        User sender = customUserDetailsService.getUserFromToken(token);
        User receiver = userRepository.findByUsername(receiverUsername)
            .orElseThrow(() -> new RuntimeException("Receiver not found"));

        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);

        Message savedMessage = messageRepository.save(message);
        System.out.println("Saved message: id=" + savedMessage.getId() + ", content=" + savedMessage.getContent() +
                          ", sender_id=" + savedMessage.getSender().getId() + " (" + savedMessage.getSender().getUsername() + ")" +
                          ", receiver_id=" + savedMessage.getReceiver().getId() + " (" + savedMessage.getReceiver().getUsername() + ")");
        return convertToDTO(savedMessage);
    }

    public List<MessageResponse> getConversation(String token, String otherUsername) {
        User currentUser = customUserDetailsService.getUserFromToken(token);
        User otherUser = userRepository.findByUsername(otherUsername)
            .orElseThrow(() -> new RuntimeException("User not found"));
        System.out.println("Fetching conversation for currentUser: " + currentUser.getId() + " (" + currentUser.getUsername() + "), otherUser: " + otherUser.getId() + " (" + otherUser.getUsername() + ")");
        List<Message> messages = messageRepository.findConversation(currentUser.getId(), otherUser.getId());
        System.out.println("Messages found: " + messages.size());
        messages.forEach(msg -> System.out.println("Message: id=" + msg.getId() + ", content=" + msg.getContent() +
                                                  ", sender_id=" + msg.getSender().getId() + " (" + msg.getSender().getUsername() + ")" +
                                                  ", receiver_id=" + msg.getReceiver().getId() + " (" + msg.getReceiver().getUsername() + ")"));
        return messages.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<ConversationResponse> getConversations(String token) {
        User currentUser = customUserDetailsService.getUserFromToken(token);
        System.out.println("Fetching conversations for user: " + currentUser.getId() + " (" + currentUser.getUsername() + ")");
        List<Message> latestMessages = messageRepository.findLatestMessagesForConversations(currentUser.getId());
        System.out.println("Conversations found: " + latestMessages.size());
        return latestMessages.stream()
            .map(message -> {
                User otherUser = message.getSender().getId().equals(currentUser.getId())
                    ? message.getReceiver()
                    : message.getSender();
                ConversationResponse dto = new ConversationResponse();
                dto.setOtherUserId(otherUser.getId());
                dto.setOtherUsername(otherUser.getUsername());
                dto.setOtherUserFullName(otherUser.getFullName());
                dto.setOtherUserProfileImage(otherUser.getProfileImage());
                dto.setLastMessageContent(message.getContent());
                dto.setLastMessageCreatedAt(message.getCreatedAt());
                dto.setLastMessageRead(message.isRead());
                System.out.println("Conversation with: " + otherUser.getUsername() + ", last message: " + message.getContent());
                return dto;
            })
            .collect(Collectors.toList());
    }

    private MessageResponse convertToDTO(Message message) {
        MessageResponse dto = new MessageResponse();
        dto.setId(message.getId());
        dto.setSenderUsername(message.getSender().getUsername());
        dto.setSenderFullName(message.getSender().getFullName());
        dto.setSenderProfileImage(message.getSender().getProfileImage());
        dto.setReceiverUsername(message.getReceiver().getUsername());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt());
        dto.setRead(message.isRead());
        return dto;
    }
}