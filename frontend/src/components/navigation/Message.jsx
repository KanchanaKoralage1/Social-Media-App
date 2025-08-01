import React, { useEffect, useState } from "react";
import Layout from "../layout/Layout";
import MessageModal from "../middle/MessageModal";

function Message() {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
      console.log("Current user:", user);
    } else {
      setError("Please log in to view messages");
    }
  }, []);

  // Fetch conversations
  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view messages");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/messages/conversations", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        console.error("Failed to fetch conversations:", res.status, res.statusText);
        setError("Failed to load conversations");
        return;
      }
      const data = await res.json();
      console.log("Conversations API response:", data);
      setConversations(
        data.map((conv) => ({
          otherUserId: conv.otherUserId,
          otherUsername: conv.otherUsername,
          otherUserFullName: conv.otherUserFullName || conv.otherUsername,
          otherUserProfileImage: conv.otherUserProfileImage
            ? conv.otherUserProfileImage.startsWith("http")
              ? conv.otherUserProfileImage
              : `http://localhost:8080/uploads/${conv.otherUserProfileImage}`
            : "/default-profile.png",
          lastMessageContent: conv.lastMessageContent,
          lastMessageCreatedAt: conv.lastMessageCreatedAt,
          lastMessageRead: conv.lastMessageRead,
        }))
      );
      setError(null);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("An error occurred while loading conversations");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const handleConversationClick = (username) => {
    setSelectedUsername(username);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUsername(null);
  };

  return (
    
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {conversations.length === 0 && !error ? (
          <div className="text-gray-500">No conversations yet.</div>
        ) : (
          <div className="space-y-4">
            {conversations.map((conv) => (
              <div
                key={conv.otherUserId}
                className="flex items-center p-4 bg-white rounded-lg shadow hover:bg-gray-100 cursor-pointer"
                onClick={() => handleConversationClick(conv.otherUsername)}
              >
                <img
                  src={conv.otherUserProfileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full mr-4"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h2 className="font-semibold">{conv.otherUserFullName}</h2>
                    <span className="text-gray-500 text-sm">
                      {new Date(conv.lastMessageCreatedAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate">
                    {conv.lastMessageContent}
                  </p>
                  {!conv.lastMessageRead && (
                    <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {isModalOpen && (
          <MessageModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            recipientUsername={selectedUsername}
            currentUser={currentUser}
          />
        )}
      </div>
   
  );
}

export default Message;