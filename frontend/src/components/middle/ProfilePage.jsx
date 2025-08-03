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
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
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
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }, []);

  // Determine if the viewed profile is the current user's profile
  const isCurrentUserProfile =
    currentLoggedInUser &&
    profile &&
    currentLoggedInUser.username === profile.username;

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      const url = username
        ? `http://localhost:8080/api/profile/${username}`
        : "http://localhost:8080/api/profile";

      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          setError("Profile not found");
          setLoading(false);
          return;
        }
        const data = await res.json();
        setProfile(data);
        setForm({
          fullName: data.fullName || "",
          bio: data.bio || "",
          website: data.website || "",
          location: data.location || "",
        });

        if (data.id) {
          setPostsLoading(true);
          const postsRes = await fetch(
            `http://localhost:8080/api/posts/user/${data.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (postsRes.ok) {
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
                isSaved: post.isSaved || false,
              }))
            );
          }
          setPostsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching profile or posts:", error);
        setError("Failed to load profile");
      }
      setLoading(false);
    };

    fetchProfileAndPosts();
  }, [username, navigate]);

  // Check following status
  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (!currentLoggedInUser || !profile || isCurrentUserProfile) {
        setIsFollowing(false);
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
          setIsFollowing(followingUsernames.includes(profile.username));
        }
      } catch (err) {
        console.error("Error checking following status:", err);
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
    formData.append("workAt", form.workAt);
    formData.append("studiedAt", form.studiedAt);
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
              fullName: updated.fullName,
            })
          );
        }
      } else {
        const errorText = await res.text();
        alert(`Failed to update profile: ${errorText}`);
      }
    } catch (error) {
      alert("An error occurred while updating profile.");
    }
  };

  const handleFollowToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token || !profile?.username) return;
    const action = isFollowing ? "unfollow" : "follow";

    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${profile.username}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setIsFollowing(!isFollowing);
        setProfile((prevProfile) => ({
          ...prevProfile,
          followersCount: isFollowing
            ? prevProfile.followersCount - 1
            : prevProfile.followersCount + 1,
        }));
      }
    } catch (err) {
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
      setProfile((prevProfile) => ({
        ...prevProfile,
        postsCount: prevProfile.postsCount - 1,
      }));
    }
  };

  const refetchPosts = async () => {
    if (!profile?.id) return;
    const token = localStorage.getItem("token");
    const postsRes = await fetch(
      `http://localhost:8080/api/posts/user/${profile.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (postsRes.ok) {
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
          isSaved: post.isSaved || false,
        }))
      );
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
      refetchPosts();
    }
  };

  const handleLike = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}/like`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    refetchPosts();
  };

  const handleShare = async (post) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:8080/api/posts/${post.id}/share`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    refetchPosts();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          {/* Header Skeleton */}
          <div className="relative">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="absolute left-8 -bottom-16">
              <div className="w-32 h-32 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse border-4 border-white dark:border-gray-800"></div>
            </div>
          </div>
          {/* Profile Info Skeleton */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Profile not found
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Cover Photo */}
        <div className="relative">
          <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500 overflow-hidden">
            <img
              src={
                profile.backgroundImage
                  ? profile.backgroundImage.startsWith("http")
                    ? profile.backgroundImage
                    : `http://localhost:8080/uploads/${profile.backgroundImage}`
                  : "/placeholder.svg?height=256&width=1024"
              }
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Profile Picture */}
          <div className="absolute left-8 -bottom-16">
            <div className="relative">
              <img
                src={
                  profile.profileImage
                    ? profile.profileImage.startsWith("http")
                      ? profile.profileImage
                      : `http://localhost:8080/uploads/${profile.profileImage}`
                    : "/placeholder.svg?height=128&width=128"
                }
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white shadow-xl"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 px-8 pb-8 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {profile.fullName || profile.username}
                </h1>
              </div>

              {profile.bio && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-400 mb-4">
                {profile.location && (
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.workAt && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-briefcase-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M6.5 1A1.5 1.5 0 0 0 5 2.5V3H1.5A1.5 1.5 0 0 0 0 4.5v1.384l7.614 2.03a1.5 1.5 0 0 0 .772 0L16 5.884V4.5A1.5 1.5 0 0 0 14.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1zm0 1h3a.5.5 0 0 1 .5.5V3H6v-.5a.5.5 0 0 1 .5-.5" />
                      <path d="M0 12.5A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5V6.85L8.129 8.947a.5.5 0 0 1-.258 0L0 6.85z" />
                    </svg>

                    {profile.workAt}
                  </div>
                )}

                {profile.studiedAt && (
                  <div className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class="bi bi-book-half"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 2.687c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                    </svg>

                    {profile.studiedAt}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.followersCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Followers
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.followingCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Following
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile.postsCount || 0}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Posts
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {isCurrentUserProfile ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleFollowToggle}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                      isFollowing
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Following
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                        Follow
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Message
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("posts")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "posts"
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                  </svg>
                  Posts
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Posts Content */}
        <div className="px-4 py-6">
          {postsLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                    </div>
                  </div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No posts yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isCurrentUserProfile
                  ? "Share your first post to get started!"
                  : "This user hasn't posted anything yet."}
              </p>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentLoggedInUser}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onLike={handleLike}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Edit Profile
              </h2>
              <button
                onClick={() => setEditMode(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg
                  className="w-6 h-6 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Where are you located?"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Work At
                </label>
                <input
                  type="text"
                  name="workAt"
                  value={form.workAt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="company name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Studied At
                </label>
                <input
                  type="text"
                  name="studiedAt"
                  value={form.studiedAt}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="school name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Profile Image
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        profileImageFile
                          ? URL.createObjectURL(profileImageFile)
                          : profile.profileImage
                          ? profile.profileImage.startsWith("http")
                            ? profile.profileImage
                            : `http://localhost:8080/uploads/${profile.profileImage}`
                          : "/placeholder.svg?height=64&width=64"
                      }
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => profileImageInput.current.click()}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Change Photo
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={profileImageInput}
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Image
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        backgroundImageFile
                          ? URL.createObjectURL(backgroundImageFile)
                          : profile.backgroundImage
                          ? profile.backgroundImage.startsWith("http")
                            ? profile.backgroundImage
                            : `http://localhost:8080/uploads/${profile.backgroundImage}`
                          : "/placeholder.svg?height=64&width=128"
                      }
                      alt="Cover preview"
                      className="w-24 h-12 rounded-lg object-cover border-2 border-gray-200 dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={() => backgroundImageInput.current.click()}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Change Cover
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={backgroundImageInput}
                      onChange={handleBackgroundImageChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {isMessageModalOpen && (
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={() => setIsMessageModalOpen(false)}
          recipientUsername={profile.username}
          currentUser={currentLoggedInUser}
        />
      )}
    </div>
  );
};

export default ProfilePage;
