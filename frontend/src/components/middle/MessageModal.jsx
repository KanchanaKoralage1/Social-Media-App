import React, { useEffect, useState, useRef } from "react";

function MessageModal({ isOpen, onClose, recipientUsername, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchConversation = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view messages");
        return;
      }

      try {
        const res = await fetch(
          `http://localhost:8080/api/messages/${recipientUsername}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) {
          console.error(
            "Failed to fetch conversation:",
            res.status,
            res.statusText
          );
          setError("Failed to load conversation");
          return;
        }
        const data = await res.json();
        console.log("Conversation API response:", data);
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            senderUsername: msg.senderUsername,
            senderFullName: msg.senderFullName,
            senderProfileImage: msg.senderProfileImage
              ? msg.senderProfileImage.startsWith("http")
                ? msg.senderProfileImage
                : `http://localhost:8080/uploads/${msg.senderProfileImage}`
              : "/default-profile.png",
            receiverUsername: msg.receiverUsername,
            content: msg.content,
            createdAt: msg.createdAt,
            isRead: msg.isRead,
          }))
        );
        setError(null);
      } catch (err) {
        console.error("Error fetching conversation:", err);
        setError("An error occurred while loading the conversation");
      }
    };

    fetchConversation();
    scrollToBottom();
  }, [isOpen, recipientUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/messages/${recipientUsername}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ content: newMessage }),
        }
      );
      if (res.ok) {
        const newMsg = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: newMsg.id,
            senderUsername: newMsg.senderUsername,
            senderFullName: newMsg.senderFullName,
            senderProfileImage: newMsg.senderProfileImage
              ? newMsg.senderProfileImage.startsWith("http")
                ? newMsg.senderProfileImage
                : `http://localhost:8080/uploads/${newMsg.senderProfileImage}`
              : "/default-profile.png",
            receiverUsername: newMsg.receiverUsername,
            content: newMsg.content,
            createdAt: newMsg.createdAt,
            isRead: newMsg.isRead,
          },
        ]);
        setNewMessage("");
      } else {
        alert("Failed to send message.");
      }
    } catch (err) {
      alert("Error sending message.");
      console.error("Error sending message:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Messages with {recipientUsername}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {error ? (
          <div className="text-red-500 mb-4">{error}</div>
        ) : (
          <div className="h-64 overflow-y-auto mb-4 p-4 bg-gray-100 rounded">
            {messages.length === 0 ? (
              <div className="text-gray-500 text-center">No messages yet.</div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.senderUsername === currentUser?.username
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.senderUsername === currentUser?.username
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      <img
                        src={message.senderProfileImage}
                        alt="Sender Profile"
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span className="font-semibold">
                        {message.senderFullName || message.senderUsername}
                      </span>
                    </div>
                    <p>{message.content}</p>
                    <p className="text-xs mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded p-2"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default MessageModal;
