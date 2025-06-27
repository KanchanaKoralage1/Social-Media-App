import React, { useEffect, useState } from "react";

const PostComment = ({ postId, currentUser, postOwnerUsername, onClose }) => {
  const [comments, setComments] = useState([]);
  const [commentValue, setCommentValue] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  // Fetch comments
  const fetchComments = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      setComments([]);
      return;
    }
    const data = await res.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Add comment
  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: new URLSearchParams({ content: commentValue }),
    });
    setCommentValue("");
    fetchComments();
  };

  // Edit comment
  const handleEdit = async (commentId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${postId}/comments/${commentId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: new URLSearchParams({ content: editingValue }),
    });
    setEditingId(null);
    setEditingValue("");
    fetchComments();
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${postId}/comments/${commentId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchComments();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>✕</button>
        <h2 className="text-lg font-bold mb-4">Comments</h2>
        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            className="flex-1 border rounded p-2"
            placeholder="Add a comment..."
            value={commentValue}
            onChange={e => setCommentValue(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Comment</button>
        </form>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {comments.map(comment => (
            <div key={comment.id} className="border-b pb-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    comment.user?.profileImage
                      ? comment.user.profileImage.startsWith("http")
                        ? comment.user.profileImage
                        : `http://localhost:8080/uploads/${comment.user.profileImage}`
                      : "/default-profile.png"
                  }
                  alt=""
                  className="w-8 h-8 rounded-full"
                />
                <span className="font-semibold">
                  {comment.user?.fullName && <>{comment.user.fullName} </>}
                  <span className="text-gray-500">@{comment.user?.username || "User"}</span>
                </span>
                <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              {editingId === comment.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleEdit(comment.id);
                  }}
                  className="flex gap-2 mt-1"
                >
                  <input
                    className="flex-1 border rounded p-1"
                    value={editingValue}
                    onChange={e => setEditingValue(e.target.value)}
                  />
                  <button type="submit" className="bg-green-500 text-white px-2 rounded">Save</button>
                  <button type="button" onClick={() => setEditingId(null)} className="bg-gray-300 px-2 rounded">Cancel</button>
                </form>
              ) : (
                <div className="ml-10 mt-1">{comment.content}</div>
              )}
              {/* Edit/Delete buttons */}
              {(currentUser?.username === comment.user?.username) && editingId !== comment.id && (
                <button
                  className="text-blue-500 text-xs mr-2"
                  onClick={() => {
                    setEditingId(comment.id);
                    setEditingValue(comment.content);
                  }}
                >
                  Edit
                </button>
              )}
              {(currentUser?.username === comment.user?.username || currentUser?.username === postOwnerUsername) && (
                <button
                  className="text-red-500 text-xs"
                  onClick={() => handleDelete(comment.id)}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostComment;