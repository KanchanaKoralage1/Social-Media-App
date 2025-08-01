package com.socialmedia.backend.repository;

import com.socialmedia.backend.model.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m " +
           "WHERE (m.sender.id = :userId AND m.receiver.id = :otherUserId) " +
           "OR (m.sender.id = :otherUserId AND m.receiver.id = :userId) " +
           "ORDER BY m.createdAt ASC")
    List<Message> findConversation(Long userId, Long otherUserId);

    @Query(value = "SELECT m.* FROM messages m " +
           "WHERE m.id IN (" +
           "    SELECT MAX(m2.id) FROM messages m2 " +
           "    WHERE m2.sender_id = :userId OR m2.receiver_id = :userId " +
           "    GROUP BY CASE " +
           "        WHEN m2.sender_id = :userId THEN m2.receiver_id " +
           "        ELSE m2.sender_id " +
           "    END" +
           ") ORDER BY m.created_at DESC", nativeQuery = true)
    List<Message> findLatestMessagesForConversations(Long userId);
}