import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../middle/PostCard";

const PostShare = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let user = {};
    try {
      user = JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {}
    setCurrentUser(user);

    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
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
          ? data.imageUrl.split(",").map((img) =>
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
          ? data.originalImageUrl.split(",").map((img) =>
              img.startsWith("http")
                ? img
                : `http://localhost:8080/uploads/${img}`
            )
          : [],
      });
    };
    fetchPost();
  }, [postId]);

  if (!post || !currentUser) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <PostCard
        post={post}
        currentUser={currentUser}
        onLike={async () => {
          const token = localStorage.getItem("token");
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
        }}
        onShare={async () => {
          const token = localStorage.getItem("token");
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
        }}
      />
    </div>
  );
};

export default PostShare;