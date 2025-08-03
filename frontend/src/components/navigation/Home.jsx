import { useState, useEffect } from "react";
import PostCreate from "../middle/PostCreate";
import PostCard from "../middle/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPosts(
        data.map((post) => ({
          id: post.id,
          user: {
            username: post.user?.username,
            fullName: post.user?.fullName,
            profileImage: post.user?.profileImage
              ? post.user.profileImage.startsWith("http")
                ? post.user.profileImage
                : `http://localhost:8080/uploads/${post.user.profileImage}`
              : "/default-profile.png",
          },
          caption: post.content,
          images: post.imageUrl
            ? post.imageUrl
                .split(",")
                .map((img) =>
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8080/uploads/${img}`
                )
            : [],
          createdAt: post.createdAt,
          likes: post.likes,
          comments: post.comments,
          isLiked: post.isLiked,
          shareCount: post.shareCount,
          originalPostId: post.originalPostId || null,
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
          originalContent: post.originalContent,
          originalImages: post.originalImageUrl
            ? post.originalImageUrl
                .split(",")
                .map((img) =>
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8080/uploads/${img}`
                )
            : [],
        }))
      );
    } catch (err) {
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
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
    const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      fetchPosts();
    } else {
      alert("Failed to update post.");
    }
  };

  const handleLike = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  const handleShare = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}/share`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  return (
    <>
    <br />
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        <br />
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back,{" "}
            {currentUser.fullName || currentUser.username || "User"}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            What's happening in your world today?
          </p>
        </div>

        <PostCreate onPostCreated={fetchPosts} />

        <div className="mt-8">
          {loading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
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
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
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
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Be the first to share something with your community!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default Home;
