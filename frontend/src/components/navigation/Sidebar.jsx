import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const navLinks = [
  {
    name: "Home",
    href: "/home",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    name: "Explore",
    href: "/explore",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: (
      <svg
      className="w-6 h-6"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.64 5.36 6 7.93 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
    ),
  },
  {
    name: "Messages",
    href: "/messages",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
  {
    name: "Saved",
    href: "/saved",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    ),
  },
  {
    name: "Profile",
    href: "/profile",
    icon: (
      <svg
        className="w-6 h-6"
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
    ),
  },
];

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({
    username: "User",
    email: "user@email.com",
    profileImage: null,
  });
  const [loading, setLoading] = useState(true);

  // Helper function to construct the full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return imagePath.startsWith("http")
      ? imagePath
      : `http://localhost:8080/uploads/${imagePath}`;
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, redirecting to login");
          navigate("/login");
          return;
        }
        const res = await fetch("http://localhost:8080/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUser({
            username: data.username || "User",
            email: data.email || "user@email.com",
            profileImage: getFullImageUrl(data.profileImage),
          });
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: data.username,
              email: data.email,
              profileImage: data.profileImage,
            })
          );
        } else {
          console.error(
            `Failed to fetch profile: ${res.status} ${res.statusText}`
          );
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        navigate("/login");
      }
      setLoading(false);
    };

    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored && stored.username && stored.email) {
        setUser({
          username: stored.username,
          email: stored.email,
          profileImage: getFullImageUrl(stored.profileImage),
        });
        fetchUserProfile();
      } else {
        fetchUserProfile();
      }
    } catch (e) {
      fetchUserProfile();
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isActive = (href) => location.pathname === href;

  return (
    <div className="flex flex-col h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex-1">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">PF</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PathFinder
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Social Media Network
              </span>
            </div>
            {closeSidebar && (
              <button
                onClick={closeSidebar}
                className="md:hidden ml-auto p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeSidebar}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                  active
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-600 dark:text-blue-400 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-purple-600 rounded-r-full"></div>
                )}
                <div
                  className={`${
                    active
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {link.icon}
                </div>
                <span className="font-medium">{link.name}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile */}
      <div className="m-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 animate-pulse"></div>
          ) : (
            <div className="relative">
              <img
                src={user.profileImage || "/default-profile.png"}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-600 shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-700"></div>
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-white truncate">
              {loading ? (
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
              ) : (
                user.username
              )}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {loading ? (
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded animate-pulse mt-1"></div>
              ) : (
                user.email
              )}
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Logout"
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
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
