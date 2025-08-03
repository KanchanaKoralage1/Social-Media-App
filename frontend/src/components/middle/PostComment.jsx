import { useEffect, useState } from "react";

const PostComment = ({ postId, currentUser, postOwnerUsername, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:8080/api/posts/${postId}/comments`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setComments([]);
        return;
      }
      const data = await res.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!commentValue.trim()) return;

    setSubmitting(true);
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: new URLSearchParams({ content: commentValue }),
      });
      setCommentValue("");
      fetchComments();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
    setSubmitting(false);
  };

  const handleEdit = async (commentId) => {
    if (!editingValue.trim()) return;

    const token = localStorage.getItem("token");
    try {
      await fetch(
        `http://localhost:8080/api/posts/${postId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: new URLSearchParams({ content: editingValue }),
        }
      );
      setEditingId(null);
      setEditingValue("");
      fetchComments();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    const token = localStorage.getItem("token");
    try {
      await fetch(
        `http://localhost:8080/api/posts/${postId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;

    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <svg
              className="w-6 h-6 text-blue-500"
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
            Comments
          </h2>
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

        {/* Add Comment Form */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <form onSubmit={handleAdd} className="flex gap-3">
            <img
              src={
                currentUser?.profileImage
                  ? currentUser.profileImage.startsWith("http")
                    ? currentUser.profileImage
                    : `http://localhost:8080/uploads/${currentUser.profileImage}`
                  : "/default-profile.png"
              }
              alt="Your profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
            />
            <div className="flex-1 flex gap-2">
              <input
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Write a comment..."
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={!commentValue.trim() || submitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Posting...
                  </>
                ) : (
                  "Post"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
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
                No comments yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Be the first to share your thoughts!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 group">
                  <img
                    src={
                      comment.user?.profileImage
                        ? comment.user.profileImage.startsWith("http")
                          ? comment.user.profileImage
                          : `http://localhost:8080/uploads/${comment.user.profileImage}`
                        : "/default-profile.png"
                    }
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {comment.user?.fullName ||
                            comment.user?.username ||
                            "User"}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>

                      {editingId === comment.id ? (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleEdit(comment.id);
                          }}
                          className="space-y-2"
                        >
                          <textarea
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                            rows={2}
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-sm"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="text-gray-800 dark:text-gray-200 leading-relaxed">
                          {comment.content}
                        </div>
                      )}
                    </div>

                    {/* Action buttons */}
                    {editingId !== comment.id && (
                      <div className="flex items-center gap-4 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentUser?.username === comment.user?.username && (
                          <button
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditingValue(comment.content);
                            }}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                          >
                            Edit
                          </button>
                        )}
                        {(currentUser?.username === comment.user?.username ||
                          currentUser?.username === postOwnerUsername) && (
                          <button
                            onClick={() => handleDelete(comment.id)}
                            className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostComment;
