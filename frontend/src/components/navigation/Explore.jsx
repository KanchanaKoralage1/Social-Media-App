import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Explore = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to construct the full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:8080/uploads/${imagePath}`;
  };

  // Fetch users to follow
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, cannot fetch users");
          setUsers([]);
          setLoadingUsers(false);
          return;
        }

        const url = searchQuery
          ? `http://localhost:8080/api/users/search?query=${encodeURIComponent(
              searchQuery
            )}`
          : "http://localhost:8080/api/users";

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUsers(
            data.map((user) => ({
              ...user,
              profileImage: getFullImageUrl(user.profileImage),
            }))
          );
        } else {
          console.error(
            `Failed to fetch users: ${res.status} ${res.statusText}`
          );
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
        setUsers([]);
      }
      setLoadingUsers(false);
    };

    // Fetch following list
    const fetchFollowing = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found, skipping fetchFollowing");
        return;
      }
      try {
        const res = await fetch("http://localhost:8080/api/profile/following", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setFollowing(data.map((u) => u.username));
        } else {
          console.error(
            `Failed to fetch following: ${res.status} ${res.statusText}`
          );
          setFollowing([]);
        }
      } catch (err) {
        console.error("Error fetching following:", err);
        setFollowing([]);
      }
    };

    fetchUsers();
    fetchFollowing();
  }, [searchQuery]);

  // Handle follow action
  const handleFollow = async (username) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot follow user");
      alert("Please log in to follow users.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${username}/follow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setFollowing((prev) => [...prev, username]);
      } else {
        const errorText = await res.text();
        console.error(
          `Failed to follow user: ${res.status} ${res.statusText} - ${errorText}`
        );
        alert(`Failed to follow ${username}: ${errorText || res.statusText}`);
      }
    } catch (err) {
      console.error("Error following user:", err);
      alert("An error occurred while trying to follow the user.");
    }
  };

  // Handle unfollow action
  const handleUnfollow = async (username) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot unfollow user");
      alert("Please log in to unfollow users.");
      return;
    }
    try {
      const res = await fetch(
        `http://localhost:8080/api/users/${username}/unfollow`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        setFollowing((prev) => prev.filter((u) => u !== username));
      } else {
        const errorText = await res.text();
        console.error(
          `Failed to unfollow user: ${res.status} ${res.statusText} - ${errorText}`
        );
        alert(`Failed to unfollow ${username}: ${errorText || res.statusText}`);
      }
    } catch (err) {
      console.error("Error unfollowing user:", err);
      alert("An error occurred while trying to unfollow the user.");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <br />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-people-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
              </div>
              <div>
                <br />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Explore People
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover and connect with new people
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search for people..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-12 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Who to Follow */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-people-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
                Who to follow
                {!loadingUsers && users.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    ({users.length} people)
                  </span>
                )}
              </h3>
            </div>

            <div className="p-6">
              {loadingUsers ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 animate-pulse"
                    >
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : "Check back later for new suggestions"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.username}
                      className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Link
                        to={`/profile/${user.username}`}
                        className="flex items-center gap-4 flex-1 min-w-0"
                      >
                        <div className="relative">
                          <img
                            src={
                              user.profileImage ||
                              "/placeholder.svg?height=48&width=48"
                            }
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-800"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 dark:text-white truncate">
                            {user.fullName || user.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            @{user.username}
                          </div>
                          {user.bio && (
                            <div className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                              {user.bio}
                            </div>
                          )}
                        </div>
                      </Link>

                      <button
                        onClick={() => {
                          if (following.includes(user.username)) {
                            handleUnfollow(user.username);
                          } else {
                            handleFollow(user.username);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex-shrink-0 ${
                          following.includes(user.username)
                            ? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md"
                        }`}
                      >
                        {following.includes(user.username)
                          ? "Following"
                          : "Follow"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
