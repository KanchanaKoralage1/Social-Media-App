import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiEdit2,
  FiTrash2,
  FiImage,
  FiX,
} from "react-icons/fi";
import PostComment from "./PostComment";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
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
  const { user, caption, images, createdAt, originalUser, originalContent, originalImages } = post;
  const isOwner = currentUser && user && currentUser.username === user.username;
  const isSharedPost = !!originalUser; // Check if this is a shared post
  const previewImages = (isSharedPost ? originalImages : images)?.slice(0, 4) || [];
  const extraCount = (isSharedPost ? originalImages : images)?.length > 4 ? (isSharedPost ? originalImages : images).length - 4 : 0;
  const [showComments, setShowComments] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(caption);
  const [editImages, setEditImages] = useState(images || []);
  const [newImages, setNewImages] = useState([]);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    setEditValue(caption);
    setEditImages(images || []);
    setNewImages([]);
  }, [caption, images, editing]);

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
    onEdit && onEdit(post, editValue, editImages, newImages.map((img) => img.file));
    setEditing(false);
  };

  const profileImgSrc = user?.profileImage || "/default-profile.png";

  return (
    <div className="bg-white rounded shadow p-4 mb-6 max-w-lg mx-auto">
      {/* Header (Sharer or Original Poster) */}
      <div className="flex items-center justify-between mb-2">
        <div
          className="flex items-center gap-3"
          onClick={() => user?.username && navigate(`/profile/${user.username}`)}
        >
          <img
            src={profileImgSrc}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <div>
            <div className="font-semibold text-gray-800 flex items-center gap-2">
              {user?.fullName && <span>{user.fullName}</span>}
              {isSharedPost && (
                <span className="text-sm text-gray-500">shared a post</span>
              )}
            </div>
            <div className="text-xs text-gray-500">{formatDate(createdAt)}</div>
          </div>
        </div>
        {isOwner && !isSharedPost && (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
              className="p-1 rounded hover:bg-gray-100"
              title="Edit"
            >
              <FiEdit2 size={18} />
            </button>
            <button
              onClick={() => onDelete && onDelete(post)}
              className="p-1 rounded hover:bg-red-100 text-red-600"
              title="Delete"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Shared Post Content */}
      {isSharedPost && (
        <div className="border p-3 rounded bg-gray-50 mb-3">
          <div
            className="flex items-center gap-3 mb-2"
            onClick={() =>
              originalUser?.username && navigate(`/profile/${originalUser.username}`)
            }
          >
            <img
              src={originalUser?.profileImage || "/default-profile.png"}
              alt="Original Profile"
              className="w-8 h-8 rounded-full object-cover border"
            />
            <div className="font-semibold text-gray-800">
              {originalUser?.fullName || originalUser?.username}
            </div>
          </div>
          <div className="text-gray-800 mb-3">{originalContent ?? ""}</div>
          {originalImages && originalImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={typeof img === "string" ? img : img.url}
                    alt={`post-img-${idx}`}
                    className="w-full h-40 object-cover rounded"
                  />
                  {idx === 3 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded">
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
      )}

      {/* Regular Post Content (if not shared) */}
      {!isSharedPost && (
        <>
          {editing ? (
            <form onSubmit={handleEditSubmit} className="mb-3 flex flex-col gap-2">
              <input
                className="border rounded p-2"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
              />
              {editImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {editImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={typeof img === "string" ? img : img.url}
                        alt={`edit-img-${idx}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEditImage(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        title="Remove"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {newImages.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {newImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img.url}
                        alt={`new-img-${idx}`}
                        className="w-full h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(idx)}
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        title="Remove"
                      >
                        <FiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                >
                  <FiImage size={18} />
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
                <span className="text-sm text-gray-500">
                  {editImages.length + newImages.length} image
                  {editImages.length + newImages.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 bg-gray-300 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mb-3 text-gray-800">{caption ?? ""}</div>
          )}
          {images && images.length > 0 && (
            <div className="grid grid-cols-2 gap-2 mb-3">
              {previewImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={typeof img === "string" ? img : img.url}
                    alt={`post-img-${idx}`}
                    className="w-full h-40 object-cover rounded"
                  />
                  {idx === 3 && extraCount > 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded">
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

      {/* Actions */}
      <div className="flex items-center gap-6 text-gray-600 border-t pt-2">
        <button
          onClick={() => onLike && onLike(post)}
          className={`flex items-center gap-1 ${
            post.isLiked ? "text-red-500" : "hover:text-red-500"
          }`}
        >
          <FiHeart size={20} />
          {post.likes > 0 && <span>{post.likes}</span>} Like
        </button>
        <button
          onClick={() => setShowComments(true)}
          className="flex items-center gap-1 hover:text-blue-500"
        >
          <FiMessageCircle size={20} />
          {post.comments > 0 && <span>{post.comments}</span>} Comment
        </button>
        <button
          onClick={() => onShare && onShare(post)}
          className="flex items-center gap-1 hover:text-green-500"
        >
          <FiShare2 size={20} />
          {post.shareCount > 0 && <span>{post.shareCount}</span>} Share
        </button>
        <button
          onClick={() => onSave && onSave(post)}
          className="ml-auto hover:text-yellow-500"
        >
          <FiBookmark size={20} />
        </button>
      </div>

      {/* Comments Modal */}
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