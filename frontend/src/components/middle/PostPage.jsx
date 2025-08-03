import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "./PostCard";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please log in to view this post");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Post not found");
          } else {
            setError("Failed to load post");
          }
          setLoading(false);
          return;
        }

        const data = await res.json();
        setPost({
          id: data.id,
          user: {
            username: data.user?.username,
            fullName: data.user?.fullName,
            profileImage: data.user?.profileImage
              ? data.user.profileImage.startsWith("http")
                ? data.user.profileImage
                : `http://localhost:8080/uploads/${data.user.profileImage}`
              : "/default-profile.png",
          },
          caption: data.content,
          images: data.imageUrl
            ? data.imageUrl
                .split(",")
                .map((img) =>
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8080/uploads/${img}`
                )
            : [],
          createdAt: data.createdAt,
          likes: data.likes,
          comments: data.comments,
          isLiked: data.isLiked,
          shareCount: data.shareCount,
          originalUser: data.originalUser
            ? {
                username: data.originalUser.username,
                fullName: data.originalUser.fullName,
                profileImage: data.originalUser.profileImage
                  ? data.originalUser.profileImage.startsWith("http")
                    ? data.originalUser.profileImage
                    : `http://localhost:8080/uploads/${data.originalUser.profileImage}`
                  : "/default-profile.png",
              }
            : null,
          originalContent: data.originalContent,
          originalImages: data.originalImageUrl
            ? data.originalImageUrl
                .split(",")
                .map((img) =>
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8080/uploads/${img}`
                )
            : [],
          isSaved: data.isSaved || false,
        });
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("An error occurred while loading the post");
      }
      setLoading(false);
    };

    fetchPost();
  }, [postId]);

  const handleDelete = async (post) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        navigate("/home");
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
        const updatedData = await res.json();
        setPost({
          ...post,
          caption: updatedData.content,
          images: updatedData.imageUrl
            ? updatedData.imageUrl
                .split(",")
                .map((img) =>
                  img.startsWith("http")
                    ? img
                    : `http://localhost:8080/uploads/${img}`
                )
            : [],
        });
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

      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPost({
        ...post,
        likes: data.likes,
        isLiked: data.isLiked,
      });
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

      const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setPost({
        ...post,
        shareCount: data.shareCount,
      });
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse">
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
        </div>
      </div>
    );
  }

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
            Oops! Something went wrong
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Post not found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The post you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        <PostCard
          post={post}
          currentUser={currentUser}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLike={handleLike}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default PostPage;
