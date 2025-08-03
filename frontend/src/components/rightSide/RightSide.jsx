import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const newsList = [
  {
    title: "React 19 Released!",
    link: "#",
    trend: "Technology",
    engagement: "12.5K",
  },
  {
    title: "Spring Boot 3.2 Announced",
    link: "#",
    trend: "Development",
    engagement: "8.2K",
  },
  {
    title: "AI is transforming social media",
    link: "#",
    trend: "AI & Tech",
    engagement: "15.7K",
  },
];

const RightSide = ({ onFollowChange }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [dark, setDark] = useState(localStorage.getItem("theme") === "dark");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [following, setFollowing] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Apply theme and persist in localStorage
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // Helper function to construct the full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:8080/uploads/${imagePath}`;
  };

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

  const handleThemeToggle = () => setDark((prev) => !prev);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (onFollowChange) onFollowChange(following);
  }, [following, onFollowChange]);

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

  return (
    <>
      {/* Mobile hamburger button */}
      <div className="lg:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 shadow-lg rounded-xl hover:shadow-xl transition-all duration-200"
        >
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className="absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <RightSideContent
              dark={dark}
              handleThemeToggle={handleThemeToggle}
              closeSidebar={() => setShowSidebar(false)}
              users={users}
              loadingUsers={loadingUsers}
              following={following}
              handleFollow={handleFollow}
              handleUnfollow={handleUnfollow}
              searchQuery={searchQuery}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-80">
        <div className="h-screen sticky top-0 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          <RightSideContent
            dark={dark}
            handleThemeToggle={handleThemeToggle}
            users={users}
            loadingUsers={loadingUsers}
            following={following}
            handleFollow={handleFollow}
            handleUnfollow={handleUnfollow}
            searchQuery={searchQuery}
            handleSearch={handleSearch}
          />
        </div>
      </div>
    </>
  );
};

const RightSideContent = ({
  dark,
  handleThemeToggle,
  closeSidebar,
  users,
  loadingUsers,
  following,
  handleFollow,
  handleUnfollow,
  searchQuery,
  handleSearch,
}) => {
  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header with search and theme toggle */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch({ target: { value: "" } })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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

        <button
          onClick={handleThemeToggle}
          className="p-3 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 flex-shrink-0"
        >
          {dark ? (
            <svg
              className="w-5 h-5 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" strokeWidth="2" />
              <path
                strokeWidth="2"
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.66 17.66l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth="2"
                d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
              />
            </svg>
          )}
        </button>

        {closeSidebar && (
          <button
            onClick={closeSidebar}
            className="lg:hidden p-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Get Verified Card */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
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
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-green-800 dark:text-green-200">
                Get Verified
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                Subscribe to unlock new features
              </p>
            </div>
          </div>
          <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200">
            Subscribe
          </button>
        </div>

        {/* Trending News */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
              <svg
                className="w-5 h-5 text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              What's happening
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {newsList.map((news, idx) => (
              <div
                key={idx}
                className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full mb-2">
                      {news.trend}
                    </span>
                    <a
                      href={news.link}
                      className="block text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {news.title}
                    </a>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {news.engagement} people talking
                    </p>
                  </div>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Who to Follow */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
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
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {loadingUsers ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg
                  className="w-12 h-12 mx-auto mb-3 opacity-50"
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
                <p className="text-sm">No users found</p>
              </div>
            ) : (
              <>
                {users.slice(0, 5).map((user) => (
                  <div
                    key={user.username}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Link
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <div className="relative flex-shrink-0">
                        <img
                          src={user.profileImage || "/default-profile.png"}
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                        />
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border border-white dark:border-gray-700"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.fullName || user.username}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          @{user.username}
                        </div>
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
                      className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

                {/* Show More Button */}
                {users.length > 5 && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Link
                      to="/explore"
                      className="w-full flex items-center justify-center gap-2 py-3 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                      <span>Show more</span>
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSide;
