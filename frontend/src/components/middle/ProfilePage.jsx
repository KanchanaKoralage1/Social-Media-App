import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../middle/PostCard";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);
  const profileImageInput = useRef();
  const backgroundImageInput = useRef();
  const { username } = useParams();
  // const { profileRefreshKey } = useOutletContext()

  useEffect(() => {
  const fetchProfileAndPosts = async () => {
    const token = localStorage.getItem("token");
    const url = username
      ? `http://localhost:8080/api/profile/${username}`
      : "http://localhost:8080/api/profile";

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    console.log("Profile API response:", data); // Debug log
    setProfile(data);
    setForm({
      fullName: data.fullName || "",
      bio: data.bio || "",
      website: data.website || "",
      location: data.location || "",
    });

    if (data.id) {
      const postsRes = await fetch(
        `http://localhost:8080/api/posts/user/${data.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const postsData = await postsRes.json();
      console.log("Posts API response:", postsData); // Debug log
      setPosts(
        postsData.map((post) => ({
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
            ? post.imageUrl.split(",").map((img) =>
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
          originalPostId: post.originalPostId || null, // Fixed mapping
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
            ? post.originalImageUrl.split(",").map((img) =>
                img.startsWith("http")
                  ? img
                  : `http://localhost:8080/uploads/${img}`
              )
            : [],
        }))
      );
    }
  };
  fetchProfileAndPosts();
}, [username]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };
  const handleBackgroundImageChange = (e) => {
    setBackgroundImageFile(e.target.files[0]);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("bio", form.bio);
    formData.append("website", form.website);
    formData.append("location", form.location);
    if (profileImageFile) formData.append("profileImage", profileImageFile);
    if (backgroundImageFile)
      formData.append("backgroundImage", backgroundImageFile);

    const res = await fetch("http://localhost:8080/api/profile/update", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    if (res.ok) {
      const updated = await res.json();
      setProfile(updated);
      setEditMode(false);
      setProfileImageFile(null);
      setBackgroundImageFile(null);
    } else {
      alert("Failed to update profile.");
    }
  };

  const handleDelete = async (post) => {
    const token = localStorage.getItem("token");
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    const res = await fetch(`http://localhost:8080/api/posts/${post.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } else {
      alert("Failed to delete post.");
    }
  };

  const handleEdit = async (post, updatedContent, keptImages, newImageFiles) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("content", updatedContent);

    // Only include images for non-shared posts
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
      const postsRes = await fetch(
        `http://localhost:8080/api/posts/user/${profile.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const postsData = await postsRes.json();
      setPosts(
        postsData.map((post) => ({
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
            ? post.imageUrl.split(",").map((img) =>
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
            ? post.originalImageUrl.split(",").map((img) =>
                img.startsWith("http")
                  ? img
                  : `http://localhost:8080/uploads/${img}`
              )
            : [],
        }))
      );
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
    const postsRes = await fetch(
      `http://localhost:8080/api/posts/user/${profile.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const postsData = await postsRes.json();
    setPosts(
      postsData.map((post) => ({
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
          ? post.imageUrl.split(",").map((img) =>
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
          ? post.originalImageUrl.split(",").map((img) =>
              img.startsWith("http")
                ? img
                : `http://localhost:8080/uploads/${img}`
            )
          : [],
      }))
    );
  };

  const handleShare = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}/share`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    const postsRes = await fetch(
      `http://localhost:8080/api/posts/user/${profile.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const postsData = await postsRes.json();
    setPosts(
      postsData.map((post) => ({
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
          ? post.imageUrl.split(",").map((img) =>
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
          ? post.originalImageUrl.split(",").map((img) =>
              img.startsWith("http")
                ? img
                : `http://localhost:8080/uploads/${img}`
            )
          : [],
      }))
    );
  };

  if (!profile) {
    return (
      <div className="text-center mt-10 text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-gray-100 rounded shadow overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img
          src={
            profile.backgroundImage
              ? profile.backgroundImage.startsWith("http")
                ? profile.backgroundImage
                : `http://localhost:8080/uploads/${profile.backgroundImage}`
              : "/default-bg.jpg"
          }
          alt="Background"
          className="w-full h-48 object-cover"
        />
        <div className="absolute left-6 -bottom-12">
          <img
            src={
              profile.profileImage
                ? profile.profileImage.startsWith("http")
                  ? profile.profileImage
                  : `http://localhost:8080/uploads/${profile.profileImage}`
                : "/default-profile.png"
            }
            alt="Profile"
            className="w-24 h-24 rounded-full border-4 border-white object-cover bg-white"
          />
        </div>
      </div>
      <div className="pt-16 px-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">
              {profile.fullName || profile.username}
            </div>
          </div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
        </div>
        <div className="mt-4 text-gray-700">{profile.bio}</div>
        <div className="mt-2 flex flex-wrap gap-4 text-gray-500 text-sm">
          {profile.location && (
            <span>
              <i className="fas fa-map-marker-alt mr-1" /> {profile.location}
            </span>
          )}
          {profile.website && (
            <span>
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                {profile.website}
              </a>
            </span>
          )}
        </div>
        <div className="mt-4 flex gap-6 text-gray-700 font-medium">
          <span>{profile.followersCount || 0} Followers</span>
          <span>{profile.followingCount || 0} Following</span>
          <span>{profile.postsCount || 0} Posts</span>
        </div>
      </div>

      {editMode && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <form
            onSubmit={handleUpdate}
            className="bg-white rounded shadow-lg p-6 w-full max-w-md relative"
          >
            <button
              className="absolute top-2 right-2 text-gray-500"
              type="button"
              onClick={() => setEditMode(false)}
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="w-full border rounded p-2"
                rows={2}
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Website</label>
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                ref={profileImageInput}
                onChange={handleProfileImageChange}
                className="w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">
                Background Image
              </label>
              <input
                type="file"
                accept="image/*"
                ref={backgroundImageInput}
                onChange={handleBackgroundImageChange}
                className="w-full"
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      )}

      <div className="mt-8 px-6 pb-6">
        <h2 className="text-xl font-bold mb-4">My Posts</h2>
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={profile}
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
};

export default ProfilePage;