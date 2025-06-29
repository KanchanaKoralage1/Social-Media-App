import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostShare = () => {
  const { postId } = useParams();
  const [user, setUser] = useState(null);
  const [originalPost, setOriginalPost] = useState(null);

  useEffect(() => {
    let currentUser = {};
    try {
      currentUser = JSON.parse(localStorage.getItem("user")) || {};
    } catch (e) {}
    setUser(currentUser);

    const fetchPost = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setOriginalPost({
        ...data,
        user: {
          ...data.user,
          profileImage: data.user?.profileImage
            ? data.user.profileImage.startsWith("http")
              ? data.user.profileImage
              : `http://localhost:8080/uploads/${data.user.profileImage}`
            : "/default-profile.png",
        },
        images: data.imageUrl
          ? data.imageUrl.split(",").map((img) =>
              img.startsWith("http")
                ? img
                : `http://localhost:8080/uploads/${img}`
            )
          : [],
        originalUser: data.originalUser
          ? {
              ...data.originalUser,
              profileImage: data.originalUser.profileImage
                ? data.originalUser.profileImage.startsWith("http")
                  ? data.originalUser.profileImage
                  : `http://localhost:8080/uploads/${data.originalUser.profileImage}`
                : "/default-profile.png",
            }
          : null,
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

  if (!user || !originalPost) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 border rounded-lg shadow-md bg-white">
      {/* User who shared */}
      <div className="flex items-center mb-4">
        <img
          src={user.profileImage}
          alt={user.fullName || user.username}
          className="w-10 h-10 rounded-full mr-3"
        />
        <h2 className="text-lg font-semibold">
          {user.fullName || user.username}
        </h2>
      </div>
      {/* Shared card: only show if originalUser exists */}
      {originalPost.originalUser && (
        <div className="border-t pt-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-2">
            <img
              src={originalPost.originalUser.profileImage}
              alt={originalPost.originalUser.fullName || originalPost.originalUser.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <h3 className="text-md font-semibold">
              {originalPost.originalUser.fullName || originalPost.originalUser.username}
            </h3>
          </div>
          <p className="text-gray-700 mb-2">
            {originalPost.originalContent}
          </p>
          {originalPost.originalImages.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {originalPost.originalImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post ${idx}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      )}
      {/* If not a share, show the post itself */}
      {!originalPost.originalUser && (
        <div className="border-t pt-4">
          <div className="flex items-center mb-2">
            <img
              src={originalPost.user.profileImage}
              alt={originalPost.user.fullName || originalPost.user.username}
              className="w-10 h-10 rounded-full mr-3"
            />
            <h3 className="text-md font-semibold">
              {originalPost.user.fullName || originalPost.user.username}
            </h3>
          </div>
          <p className="text-gray-700 mb-2">
            {originalPost.content}
          </p>
          {originalPost.images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {originalPost.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Post ${idx}`}
                  className="w-full h-auto rounded-lg"
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostShare;