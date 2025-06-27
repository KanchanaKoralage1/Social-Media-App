import React, { useEffect, useState, useRef } from "react";
import PostCard from "../middle/PostCard";
import { useParams } from "react-router-dom";

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

  // Fetch profile and posts on mount
  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem("token");
       const url = username
        ? `http://localhost:8080/api/profile/${username}`
        : "http://localhost:8080/api/profile";
        
      // const res = await fetch("http://localhost:8080/api/profile", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });

      const res = await fetch(url, {
  headers: { Authorization: `Bearer ${token}` },
});
      const data = await res.json();
      setProfile(data);
      setForm({
        fullName: data.fullName || "",
        bio: data.bio || "",
        website: data.website || "",
        location: data.location || "",
      });

      // Fetch posts for this user
      if (data.id) {
        const postsRes = await fetch(`http://localhost:8080/api/posts/user/${data.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postsData = await postsRes.json();
        setPosts(
          postsData.map((post) => ({
            ...post,
            caption: post.content,
            images: post.imageUrl
              ? post.imageUrl.split(",").map((img) =>
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

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle image file changes
  const handleProfileImageChange = (e) => {
    setProfileImageFile(e.target.files[0]);
  };
  const handleBackgroundImageChange = (e) => {
    setBackgroundImageFile(e.target.files[0]);
  };

  // Handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("bio", form.bio);
    formData.append("website", form.website);
    formData.append("location", form.location);
    if (profileImageFile) formData.append("profileImage", profileImageFile);
    if (backgroundImageFile) formData.append("backgroundImage", backgroundImageFile);

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

  if (!profile) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl  mx-auto mt-8 bg-gray-100 rounded shadow overflow-hidden">
      {/* Background Image */}
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
        {/* Profile Image */}
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
      {/* Profile Info */}
      <div className="pt-16 px-6 pb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">{profile.fullName || profile.username}</div>
            
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
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="underline">
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

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0  bg-opacity-40 flex items-center justify-center z-50">
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
              <label className="block text-sm font-medium mb-1">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                ref={profileImageInput}
                onChange={handleProfileImageChange}
                className="w-full"
              />
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium mb-1">Background Image</label>
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

      {/* User's Posts */}
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
              // Optionally add onEdit, onDelete, etc.
            />
          ))
        )}
      </div>
    </div>
  );
};

export default ProfilePage;