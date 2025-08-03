import { useEffect, useState, useRef } from "react";

function MessageModal({ isOpen, onClose, recipientUsername, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!isOpen) return;

    const fetchConversation = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to view messages");
        setLoading(false);
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
          setError("Failed to load conversation");
          setLoading(false);
          return;
        }

        const data = await res.json();
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
      setLoading(false);
    };

    fetchConversation();
    // Focus input when modal opens
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, recipientUsername]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
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
    setSending(false);
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Messages
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                with @{recipientUsername}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No messages yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start the conversation by sending a message!
                </p>
              </div>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isCurrentUser =
                  message.senderUsername === currentUser?.username;
                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isCurrentUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-3 max-w-xs ${
                        isCurrentUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      <img
                        src={message.senderProfileImage || "/placeholder.svg"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                      />
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          isCurrentUser
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                        }`}
                      >
                        <p className="leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isCurrentUser
                              ? "text-blue-100"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {formatTime(message.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={sending}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
