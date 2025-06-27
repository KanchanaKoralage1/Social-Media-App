import React, { useRef, useState } from "react";
import { FiImage, FiX } from "react-icons/fi";

const PostCreate = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const fileInputRef = useRef();

  // Get user info from localStorage or use defaults
  let profileImg = "/default-profile.png";
  let username = "User";
  let fullName = "";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      if (user.profileImage)
        profileImg = user.profileImage.startsWith("http")
          ? user.profileImage
          : `http://localhost:8080/uploads/${user.profileImage}`;
      if (user.username) username = user.username;
      if (user.fullName) fullName = user.fullName;
    }
  } catch (e) {}

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", caption);
    images.forEach(img => formData.append("images", img.file));

    await fetch("http://localhost:8080/api/posts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    setCaption("");
    setImages([]);
    if (onPostCreated) onPostCreated();
  };

  const previewImages = images.slice(0, 4);
  const extraCount = images.length - 4;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-8 bg-white rounded shadow p-4 flex flex-col gap-4"
    >
      {/* Profile image and username/fullName */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={profileImg}
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border"
        />
        <span className="font-semibold text-gray-800">
          {fullName ? fullName : username}
        </span>
        {fullName && (
          <span className="text-gray-500 ml-2">@{username}</span>
        )}
      </div>
      <textarea
        className="w-full border rounded p-2 resize-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        placeholder="What's on your mind?"
        value={caption}
        onChange={e => setCaption(e.target.value)}
      />
      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previewImages.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img.url}
                alt={`preview-${idx}`}
                className="w-full h-32 object-cover rounded"
              />
              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                title="Remove"
              >
                <FiX size={16} />
              </button>
              {/* Overlay for extra images */}
              {idx === 3 && extraCount > 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded">
                  <span className="text-white text-xl font-bold">+{extraCount}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {/* Image upload button */}
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
          onChange={handleImageChange}
        />
        <span className="text-sm text-gray-500">{images.length} image{images.length !== 1 ? "s" : ""} selected</span>
      </div>
      {/* Submit button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
        disabled={!caption && images.length === 0}
      >
        Post
      </button>
    </form>
  );
};

export default PostCreate;