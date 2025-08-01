import { useEffect, useState } from "react";
import PostCard from "../middle/PostCard";

function Saved() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  let currentUser = {};
  try {
    currentUser = JSON.parse(localStorage.getItem("user")) || {};
  } catch (e) {}

  const fetchSaved = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
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
      } else {
        setPosts([]);
      }
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handlePostCardSave = (postToUpdate, isNowSaved) => {
    if (!isNowSaved) {
      setPosts((prev) => prev.filter((p) => p.id !== postToUpdate.id));
    } else {
      fetchSaved();
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading saved posts...
      </div>
    );

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
            currentUser={currentUser}
            onSave={handlePostCardSave}
          />
        ))
      )}
    </div>
  );
}

export default Saved;
