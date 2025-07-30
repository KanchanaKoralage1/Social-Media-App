"use client"

import { useEffect, useState } from "react"
import PostCard from "../middle/PostCard"

function Saved() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Highlight: Get current user for PostCard's isOwner logic
  let currentUser = {}
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {}
  } catch (e) {}

  const fetchSaved = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const res = await fetch("http://localhost:8080/api/posts/saved", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        // Map backend fields to what PostCard expects, and fix image URLs
        const mapImages = (imgStr) =>
          imgStr
            ? imgStr
                .split(",")
                .filter((url) => url.trim() !== "")
                .map((url) => (url.startsWith("http") ? url : `http://localhost:8080/uploads/${url.trim()}`))
            : []
        const mapped = data.map((post) => ({
          ...post,
          caption: post.content,
          images: mapImages(post.imageUrl),
          originalImages: mapImages(post.originalImageUrl),
          isSaved: true, // Highlight: Explicitly set isSaved to true for posts in this section
          user: {
            // Highlight: Ensure user object is correctly mapped for PostCard
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
        }))
        setPosts(mapped)
      } else {
        setPosts([])
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error)
      setPosts([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchSaved()
  }, [])

  // Highlight: Handle onSave callback from PostCard
  const handlePostCardSave = (postToUpdate, isNowSaved) => {
    if (!isNowSaved) {
      // If the post is now unsaved, remove it from the list
      setPosts((prev) => prev.filter((p) => p.id !== postToUpdate.id))
    } else {
      // If it's saved, we might need to re-fetch or add it if it wasn't there (less common for 'Saved' page)
      // For simplicity, if it's saved, we assume it's already in the list or will be on next full fetch.
      // If you want to immediately add it, you'd need the full post object.
      fetchSaved() // Re-fetch all saved posts to ensure consistency
    }
  }

  if (loading) return <div className="text-center mt-10 text-gray-500">Loading saved posts...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Saved Posts</h1>
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">No saved posts yet.</div>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            currentUser={currentUser} // Highlight: Pass currentUser for proper rendering
            onSave={handlePostCardSave} // Highlight: Pass the new handler
            // Other handlers (onEdit, onDelete, onLike, onShare) might also be needed if you want full functionality on saved posts
          />
        ))
      )}
    </div>
  )
}

export default Saved
