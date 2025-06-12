// src/components/PostList.jsx
import React, { useState, useEffect } from "react";
import { getAllPosts } from "../../services/postService";
import TweetCard from "./TweetCard";

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getAllPosts();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostDeleted = (deletedPostId) => {
    setPosts(posts.filter((post) => post.id !== deletedPostId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
  };

  return (
    <div>
      {posts.map((post) => (
        <TweetCard
          key={post.id}
          post={post}
          onPostDeleted={() => handlePostDeleted(post.id)}
          onUpdatePost={handleUpdatePost}
        />
      ))}
    </div>
  );
}

export default PostList;