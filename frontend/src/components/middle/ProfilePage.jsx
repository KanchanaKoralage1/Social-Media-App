import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PostCard from "../middle/PostCard";
import MessageModal from "./MessageModal";

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
  const navigate = useNavigate();
  const [currentLoggedInUser, setCurrentLoggedInUser] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [error, setError] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Load current logged-in user from localStorage
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      setCurrentLoggedInUser(user);
      console.log("Current logged-in user:", user?.username);
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  // Determine if the viewed profile is the current user's profile
  // Highlight: This condition is crucial for showing Edit vs. Follow button
  const isCurrentUserProfile =
    currentLoggedInUser &&
    profile &&
    currentLoggedInUser.username === profile.username;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      const token = localStorage.getItem("token");
      // Highlight: Use username from URL if present, otherwise fetch current user's profile
      const url = username
        ? `http://localhost:8080/api/profile/${username}`
        : "http://localhost:8080/api/profile";

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error("Failed to fetch profile:", res.status, res.statusText);
          setProfile(null);
          setPosts([]);
          return;
        }
        const data = await res.json();
        console.log("Profile API response:", data);
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
          if (!postsRes.ok) {
            console.error(
              "Failed to fetch posts:",
              postsRes.status,
              postsRes.statusText
            );
            setPosts([]);
            return;
          }
          const postsData = await postsRes.json();
          console.log("Posts API response:", postsData);
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
              shareCount: post.shareCount,
              originalPostId: post.originalPostId || null,
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
              originalContent: post.originalContent, // Corrected: should be post.originalContent
              originalImages: post.originalImageUrl
                ? post.originalImageUrl
                    .split(",")
                    .map((img) =>
                      img.startsWith("http")
                        ? img
                        : `http://localhost:8080/uploads/${img}`
                    )
                : [],
              isSaved: post.isSaved || false, // Added: Support for post saving
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching profile or posts:", error);
        setProfile(null);
        setPosts([]);
      }
    };

    fetchProfileAndPosts();
  }, [username, navigate]); // Re-fetch when username in URL changes

  // Check following status when profile or currentLoggedInUser changes
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!currentLoggedInUser || !profile || isCurrentUserProfile) {
        setIsFollowing(false); // Not following self, or no data yet
        return;
      }
      const token = localStorage.getItem("token");
      if (!token) {
        setIsFollowing(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:8080/api/profile/following", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const followingUsernames = data.map((u) => u.username);
          console.log(
            "Checking if following",
            profile.username,
            "in",
            followingUsernames
          );
          setIsFollowing(followingUsernames.includes(profile.username));
        } else {
          console.error(
            "Failed to fetch following list:",
            res.status,
            res.statusText
          );
          setIsFollowing(false);
        }
      } catch (err) {
        console.error("Error checking following status:", err);
        setIsFollowing(false);
      }
    };

    checkFollowingStatus();
  }, [currentLoggedInUser, profile, isCurrentUserProfile]);

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

    try {
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
        // Update localStorage user profile image if it's the current user
        if (
          currentLoggedInUser &&
          currentLoggedInUser.username === updated.username
        ) {
          const storedUser = JSON.parse(localStorage.getItem("user"));
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...storedUser,
              profileImage: updated.profileImage,
              fullName: updated.fullName, // Also update full name
            })
          );
        }
      } else {
        const errorText = await res.text();
        alert(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      alert("An error occurred while updating profile.");
      console.error("Update profile error:", error);
    }
  };

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile?.username) return;

    const action = isFollowing ? "unfollow" : "follow";
    const method = "POST";

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${profile.username}/${action}`,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        setIsFollowing(!isFollowing);
        // Optimistically update follower count
        setProfile((prevProfile) => ({
          ...prevProfile,
          followersCount: isFollowing
            ? prevProfile.followersCount - 1
            : prevProfile.followersCount + 1,
        }));
      } else {
        const errorText = await res.text();
        alert(`Failed to ${action} user: ${errorText || res.statusText}`);
      }
    } catch (err) {
      alert(`An error occurred while trying to ${action} the user.`);
      console.error(`Error during ${action}:`, err);
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
      // Also decrement postsCount in profile state
      setProfile((prevProfile) => ({
        ...prevProfile,
        postsCount: prevProfile.postsCount - 1,
      }));
    } else {
      alert("Failed to delete post.");
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
      // Re-fetch posts for the current profile to ensure updated data
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
            ? post.originalImageUrl
                .split(",")
                .map((img) =>
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
    // Re-fetch posts to update like counts and isLiked status
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
          ? post.originalImageUrl
              .split(",")
              .map((img) =>
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
    // Re-fetch posts to update share counts
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
          ? post.originalImageUrl
              .split(",")
              .map((img) =>
                img.startsWith("http")
                  ? img
                  : `http://localhost:8080/uploads/${img}`
              )
          : [],
      }))
    );
  };

  const handleMessage = () => {
    setIsMessageModalOpen(true);
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
          {/* Highlight: Conditional rendering for Edit Profile vs. Follow/Following button */}
          {isCurrentUserProfile ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700"
              onClick={() => setEditMode(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className={`px-4 py-2 rounded font-semibold transition ${
                  isFollowing
                    ? "bg-gray-300 text-gray-800 hover:bg-gray-400"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                onClick={handleFollowToggle}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700"
                onClick={handleMessage}
              >
                Message
              </button>
            </>
          )}
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
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
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
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>
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

      {isMessageModalOpen && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          recipientUsername={profile.username}
          currentUser={currentLoggedInUser}
        />
      )}

      <div className="mt-8 px-6 pb-6">
        <h2 className="text-xl font-bold mb-4">Posts</h2>{" "}
        {/* Changed "My Posts" to "Posts" */}
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts yet.</div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentLoggedInUser} // Pass currentLoggedInUser for proper rendering
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
