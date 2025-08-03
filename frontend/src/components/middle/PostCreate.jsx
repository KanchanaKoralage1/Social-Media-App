import { useRef, useState } from "react";

const PostCreate = ({ onPostCreated }) => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef();

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
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (idx) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[idx].url);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!caption.trim() && images.length === 0) return;

    setIsSubmitting(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", caption);
    images.forEach((img) => formData.append("images", img.file));

    try {
      await fetch("http://localhost:8080/api/posts", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      setCaption("");
      setImages([]);
      if (onPostCreated) onPostCreated();
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setIsSubmitting(false);
  };

  const previewImages = images.slice(0, 4);
  const extraCount = images.length - 4;

  return (
    
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Header */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={profileImg || "/placeholder.svg"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {fullName || username}
            </div>
            {fullName && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                @{username}
              </div>
            )}
          </div>
        </div>

        {/* Text Input */}
        <textarea
          className="w-full border-0 resize-none focus:ring-0 text-lg placeholder-gray-500 dark:placeholder-gray-400 bg-transparent text-gray-900 dark:text-white"
          rows={3}
          placeholder="What's happening?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {previewImages.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img.url || "/placeholder.svg"}
                  alt={`preview-${idx}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
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

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
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
              <span className="font-medium">Photos</span>
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            {images.length > 0 && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {images.length} image{images.length !== 1 ? "s" : ""} selected
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={(!caption.trim() && images.length === 0) || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
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
    
  );
};

export default PostCreate;
