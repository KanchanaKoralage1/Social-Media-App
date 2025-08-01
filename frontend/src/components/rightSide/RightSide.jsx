import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const newsList = [
  { title: "React 19 Released!", link: "#" },
  { title: "Spring Boot 3.2 Announced", link: "#" },
  { title: "AI is transforming social media", link: "#" },
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
              profileImage: getFullImageUrl(user.profileImage), // Construct full URL
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

  // When following changes, notify parent (profile page) if callback provided
  useEffect(() => {
    if (onFollowChange) onFollowChange(following);
  }, [following, onFollowChange]);

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded bg-blue-600 text-white"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Sidebar overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40"
          onClick={() => setShowSidebar(false)}
        >
          <div
            className={`absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg transition-all`}
            onClick={(e) => e.stopPropagation()}
          >
            <RightSideContent
              dark={dark}
              handleThemeToggle={handleThemeToggle}
              closeSidebar={() => setShowSidebar(false)}
              users={users}
              loadingUsers={loadingUsers}
              following={following}
              setFollowing={setFollowing}
              searchQuery={searchQuery}
              handleSearch={handleSearch}
            />
          </div>
        </div>
      )}
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-80">
        <div
          className={`h-screen sticky top-0 bg-white dark:bg-gray-900 border-l`}
        >
          <RightSideContent
            dark={dark}
            handleThemeToggle={handleThemeToggle}
            users={users}
            loadingUsers={loadingUsers}
            following={following}
            setFollowing={setFollowing}
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
  setFollowing,
  searchQuery,
  handleSearch,
}) => {
  const handleFollow = async (username) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, cannot follow user");
      alert("Please log in to follow users.");
      return;
    }
    try {
      console.log("Following user:", username, "with TOKEN:", token);
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
        alert(`Successfully followed ${username}`);
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
      console.log("Unfollowing user:", username, "with TOKEN:", token);
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
        alert(`Successfully unfollowed ${username}`);
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
    <div className="flex flex-col h-full p-4 space-y-6">
      {/* 1. Search + Theme Toggle */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        {searchQuery && (
          <button
            onClick={() => searchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-300"
          >
            ✕
          </button>
        )}
        <button
          onClick={handleThemeToggle}
          className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          title="Toggle theme"
        >
          {dark ? (
            // Sun icon for light mode
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="orange"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="5" strokeWidth="2" />
              <path
                strokeWidth="2"
                d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.66 17.66l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42"
              />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg
              width="20"
              height="20"
              fill="none"
              stroke="black"
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
            className="ml-2 md:hidden text-gray-500 text-xl"
          >
            ✕
          </button>
        )}
      </div>
      {/* 2. Verify Button */}
      <div>
        <button className="w-full py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition">
          Get Verified ✔️
        </button>
      </div>
      {/* 3. Top News */}
      <div>
        <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">
          Top News
        </h3>
        <ul className="space-y-1">
          {newsList.map((news, idx) => (
            <li key={idx}>
              <a
                href={news.link}
                className="text-blue-600 hover:underline dark:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                {news.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
      {/* 4. Suggestions */}
      <div className="flex-1 overflow-y-auto max-h-100">
        <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">
          Who to follow
        </h3>
        {loadingUsers ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-2">
            {users.map((user) => (
              <li
                key={user.username}
                className="flex items-center justify-between"
              >
                <Link
                  to={`/profile/${user.username}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={user.profileImage || "/default-profile.png"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div>
                    <div className="font-semibold">
                      {user.fullName || user.username}
                    </div>
                    <div className="text-xs text-gray-500">
                      @{user.username}
                    </div>
                  </div>
                </Link>
                <button
                  className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition"
                  // Remove disabled attribute to allow toggling
                  onClick={() => {
                    if (following.includes(user.username)) {
                      handleUnfollow(user.username);
                    } else {
                      handleFollow(user.username);
                    }
                  }}
                >
                  {following.includes(user.username) ? "Following" : "Follow"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default RightSide;
