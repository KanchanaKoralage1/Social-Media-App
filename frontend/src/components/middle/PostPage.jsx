import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostCard from "./PostCard";

const PostPage = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      console.log("Token used for fetch:", token);
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Single Post API response:", data);
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
      });
    };

    fetchPost();
  }, [postId]);

  if (!post) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading post...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <PostCard post={post} />
    </div>
  );
};

export default PostPage;
