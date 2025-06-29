import React, { useState, useEffect } from "react";
import Layout from "../layout/Layout";
import PostCreate from "../middle/PostCreate";
import PostCard from "../middle/PostCard";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get current user from localStorage
  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  // Fetch posts from backend
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
            fullName: post.user?.fullName, // add this if you want full name
            profileImage: post.user?.profileImage, // <-- CORRECT
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

  // Delete post handler
  const handleDelete = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchPosts();
  };

  // Edit post handler
  const handleEdit = async (
    post,
    updatedContent,
    keptImages,
    newImageFiles
  ) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", updatedContent);

    // Send kept image URLs as a comma-separated string (if your backend supports it)
    // If not, you may need to adjust backend to accept this param
    formData.append("keptImages", keptImages.join(","));

    // Add new images
    newImageFiles.forEach((file) => formData.append("images", file));

    const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // DO NOT set Content-Type, browser will set it for FormData
      },
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
    fetchPosts(); // Refresh posts to update like count and isLiked
  };

  const handleShare = async (post) => {
  const token = localStorage.getItem("token");
  await fetch(`http://localhost:8080/api/posts/${post.id}/share`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchPosts(); // Refresh posts to update share count
};

  return (
   
      
<div>
      
  <PostCreate onPostCreated={fetchPosts} />

      <div className="mt-6">
        
        {loading ? (
          <div className="text-center text-gray-500">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="text-center text-gray-500">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={handleLike}
              onShare={handleShare}
            />
          ))
        )}
      </div>
      </div>
    
  );
}

export default Home;
