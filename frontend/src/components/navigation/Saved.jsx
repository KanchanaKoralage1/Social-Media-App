import { useEffect, useState } from "react";
import PostCard from "../middle/PostCard";

function Saved() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  const fetchSaved = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Please log in to view saved posts");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/posts/saved", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const mapImages = (imgStr) =>
          imgStr
            ? imgStr
                .split(",")
                .filter((url) => url.trim() !== "")
                .map((url) =>
                  url.startsWith("http")
                    ? url
                    : `http://localhost:8080/uploads/${url.trim()}`
                )
            : [];

        const mapped = data.map((post) => ({
          ...post,
          caption: post.content,
          images: mapImages(post.imageUrl),
          originalImages: mapImages(post.originalImageUrl),
          isSaved: true,
          user: {
            username: post.user?.username,
            fullName: post.user?.fullName,
            profileImage: post.user?.profileImage
              ? post.user.profileImage.startsWith("http")
                ? post.user.profileImage
                : `http://localhost:8080/uploads/${post.user.profileImage}`
              : "/default-profile.png",
          },
          originalUser: post.originalUser
            ? {
                username: post.originalUser.username,
                fullName: post.originalUser.fullName,
                profileImage: post.originalUser.profileImage
                  ? post.originalUser.profileImage.startsWith("http")
                    ? post.originalUser.profileImage
                    : `http://localhost:8080/uploads/${post.originalUser.profileImage}`
                  : "/default-profile.png",
              }
            : null,
        }));
        setPosts(mapped);
      } else if (res.status === 401) {
        setError("Please log in to view saved posts");
      } else {
        setError("Failed to load saved posts");
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setError("An error occurred while loading saved posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handlePostCardSave = (postToUpdate, isNowSaved) => {
    if (!isNowSaved) {
      // Remove from saved posts when unsaved
      setPosts((prev) => prev.filter((p) => p.id !== postToUpdate.id));
    } else {
      // Refresh saved posts when a post is saved
      fetchSaved();
    }
  };

  const handleDelete = async (post) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== post.id));
      } else {
        alert("Failed to delete post.");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("An error occurred while deleting the post.");
    }
  };

  const handleEdit = async (
    post,
    updatedContent,
    keptImages,
    newImageFiles
  ) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", updatedContent);

    if (!post.originalUser) {
      formData.append("keptImages", keptImages.join(","));
      newImageFiles.forEach((file) => formData.append("images", file));
    }

    try {
      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        fetchSaved(); // Refresh saved posts after edit
      } else {
        alert("Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      alert("An error occurred while updating the post.");
    }
  };

  const handleLike = async (post) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSaved(); // Refresh to update like status
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async (post) => {
    const token = localStorage.getItem("token");
    try {
      await fetch(`http://localhost:8080/api/posts/${post.id}/share`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSaved(); // Refresh to update share count
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  if (error) {
    return (
     
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchSaved}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
      
    );
  }

  return (
    <>
    <br />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <br />
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Saved Posts
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {loading
                  ? "Loading..."
                  : `${posts.length} saved ${
                      posts.length === 1 ? "post" : "posts"
                    }`}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-yellow-600 dark:text-yellow-400"
                fill="none"
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
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No saved posts yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              When you save posts, they'll appear here. Start exploring and save
              posts you want to read later!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => (window.location.href = "/home")}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go to Home
              </button>
              <button
                onClick={() => (window.location.href = "/explore")}
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Explore Posts
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <svg
                      className="w-5 h-5 text-yellow-500"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <span className="font-medium">
                      {posts.length} saved posts
                    </span>
                  </div>
                </div>
                <button
                  onClick={fetchSaved}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Refresh"
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
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="relative">
                  {/* Saved indicator */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                      Saved
                    </div>
                  </div>

                  <PostCard
                    post={post}
                    currentUser={currentUser}
                    onSave={handlePostCardSave}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onLike={handleLike}
                    onShare={handleShare}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button (if needed in future) */}
            {posts.length > 0 && (
              <div className="text-center mt-8">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  You've reached the end of your saved posts
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </>
  );
}

export default Saved;
