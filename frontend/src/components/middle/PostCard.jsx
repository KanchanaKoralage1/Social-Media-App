import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PostComment from "./PostComment";

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

const PostCard = ({
  post,
  currentUser,
  onEdit,
  onDelete,
  onLike,
  onComment,
  onShare,
  onSave,
}) => {
  const {
    user,
    caption,
    images,
    createdAt,
    originalUser,
    originalContent,
    originalImages,
    originalPostId,
    isSaved,
  } = post;

  const isOwner = currentUser && user && currentUser.username === user.username;
  const isSharedPost = !!originalUser;
  const previewImages =
    (isSharedPost ? originalImages : images)?.slice(0, 4) || [];
  const extraCount =
    (isSharedPost ? originalImages : images)?.length > 4
      ? (isSharedPost ? originalImages : images).length - 4
      : 0;

  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(caption);
  const [editImages, setEditImages] = useState(images || []);
  const [newImages, setNewImages] = useState([]);
  const [isPostSaved, setIsPostSaved] = useState(isSaved);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setEditValue(caption);
    setEditImages(images || []);
    setNewImages([]);
  }, [caption, images, editing]);

  useEffect(() => {
    setIsPostSaved(isSaved);
  }, [isSaved]);

  const handleRemoveEditImage = (idx) => {
    setEditImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleEditImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImgs = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setNewImages((prev) => [...prev, ...newImgs]);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    onEdit &&
      onEdit(
        post,
        editValue,
        isSharedPost ? [] : editImages,
        isSharedPost ? [] : newImages.map((img) => img.file)
      );
    setEditing(false);
  };

  const handlePostClick = (e) => {
    if (originalPostId) {
      navigate(`/post/${originalPostId}`);
    }
  };

  const handleToggleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch(
        `http://localhost:8080/api/posts/${post.id}/save`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setIsPostSaved(data.saved);
        if (onSave) onSave(post, data.saved);
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  const profileImgSrc = user?.profileImage || "/default-profile.png";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              user?.username && navigate(`/profile/${user.username}`)
            }
          >
            <div className="relative">
              <img
                src={profileImgSrc || "/placeholder.svg"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {user?.fullName || user?.username}
                </span>
                {isSharedPost && (
                  <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    shared
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(createdAt)}
              </div>
            </div>
          </div>

          {isOwner && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                  >
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
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete && onDelete(post);
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Edit Form for Shared Posts */}
        {editing && isSharedPost && (
          <form onSubmit={handleEditSubmit} className="mb-4 space-y-3">
            <textarea
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
              rows={3}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Edit your share caption..."
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Shared Post Content */}
        {isSharedPost && (
          <>
            {!editing && caption && (
              <div className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                {caption}
              </div>
            )}
            <div
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700/50 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={handlePostClick}
            >
              <div
                className="flex items-center gap-3 mb-3"
                onClick={(e) => {
                  e.stopPropagation();
                  originalUser?.username &&
                    navigate(`/profile/${originalUser.username}`);
                }}
              >
                <img
                  src={originalUser?.profileImage || "/default-profile.png"}
                  alt="Original Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {originalUser?.fullName || originalUser?.username}
                </span>
              </div>
              {originalContent && (
                <div className="text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">
                  {originalContent}
                </div>
              )}
              {originalImages && originalImages.length > 0 && (
                <div
                  className={`grid gap-2 ${
                    previewImages.length === 1
                      ? "grid-cols-1"
                      : previewImages.length === 2
                      ? "grid-cols-2"
                      : "grid-cols-2"
                  }`}
                >
                  {previewImages.map((img, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={typeof img === "string" ? img : img.url}
                        alt={`post-img-${idx}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {idx === 3 && extraCount > 0 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                          <span className="text-white text-xl font-bold">
                            +{extraCount}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Regular Post Content */}
        {!isSharedPost && (
          <>
            {editing ? (
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <textarea
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  rows={3}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="What's on your mind?"
                />

                {/* Edit Images */}
                {editImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {editImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={typeof img === "string" ? img : img.url}
                          alt={`edit-img-${idx}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveEditImage(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Images */}
                {newImages.length > 0 && (
                  <div className="grid grid-cols-2 gap-3">
                    {newImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={`new-img-${idx}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
                        >
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center gap-2 px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Add Images
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleEditImageChange}
                    />
                    {editImages.length + newImages.length > 0 && (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {editImages.length + newImages.length} image
                        {editImages.length + newImages.length !== 1
                          ? "s"
                          : ""}{" "}
                        selected
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <>
                {caption && (
                  <div className="text-gray-900 dark:text-white mb-4 leading-relaxed">
                    {caption}
                  </div>
                )}
                {images && images.length > 0 && (
                  <div
                    className={`grid gap-2 ${
                      previewImages.length === 1
                        ? "grid-cols-1"
                        : previewImages.length === 2
                        ? "grid-cols-2"
                        : "grid-cols-2"
                    }`}
                  >
                    {previewImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={typeof img === "string" ? img : img.url}
                          alt={`post-img-${idx}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {idx === 3 && extraCount > 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
                            <span className="text-white text-xl font-bold">
                              +{extraCount}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onLike && onLike(post)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                post.isLiked
                  ? "text-red-500 bg-red-50 dark:bg-red-900/20"
                  : "text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              }`}
            >
              <svg
                className={`w-5 h-5 ${post.isLiked ? "fill-current" : ""}`}
                fill={post.isLiked ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-medium">
                {post.likes > 0 ? post.likes : ""}
              </span>
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            >
              <svg
                className="w-5 h-5"
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
              <span className="font-medium">
                {post.comments > 0 ? post.comments : ""}
              </span>
            </button>

            <button
              onClick={() => onShare && onShare(post)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              <span className="font-medium">
                {post.shareCount > 0 ? post.shareCount : ""}
              </span>
            </button>
          </div>

          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-lg transition-all ${
              isPostSaved
                ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
            }`}
            title={isPostSaved ? "Unsave Post" : "Save Post"}
          >
            <svg
              className={`w-5 h-5 ${isPostSaved ? "fill-current" : ""}`}
              fill={isPostSaved ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      {showComments && (
        <PostComment
          postId={post.id}
          currentUser={currentUser}
          postOwnerUsername={user?.username}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
};

export default PostCard;
