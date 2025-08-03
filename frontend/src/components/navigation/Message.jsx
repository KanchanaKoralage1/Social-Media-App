import { useEffect, useState } from "react";
import MessageModal from "../middle/MessageModal";

function Message() {
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setCurrentUser(user);
    } else {
      setError("Please log in to view messages");
    }
  }, []);

  const fetchConversations = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view messages");
      return;
    }
    try {
      const res = await fetch(
        "http://localhost:8080/api/messages/conversations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setError("Failed to load conversations");
        return;
      }
      const data = await res.json();
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
      setError("An error occurred while loading conversations");
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchConversations();
      const interval = setInterval(fetchConversations, 10000);
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
    <>
    <br />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <br />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Messages
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Stay connected with your community
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-500"
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
              <span className="text-red-700 dark:text-red-300">{error}</span>
            </div>
          </div>
        )}

        {conversations.length === 0 && !error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
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
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No conversations yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Start a conversation by visiting someone's profile and clicking
              "Message"
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => (
              <div
                key={conv.otherUserId}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-700 cursor-pointer transition-all duration-200"
                onClick={() => handleConversationClick(conv.otherUsername)}
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={conv.otherUserProfileImage || "/placeholder.svg"}
                      alt="Profile"
                      className="w-14 h-14 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                        {conv.otherUserFullName}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {new Date(conv.lastMessageCreatedAt).toLocaleString(
                          [],
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-gray-600 dark:text-gray-300 truncate text-sm">
                        {conv.lastMessageContent}
                      </p>
                      {!conv.lastMessageRead && (
                        <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                  </div>

                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
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
    </div>
    </>
  );
}

export default Message;
