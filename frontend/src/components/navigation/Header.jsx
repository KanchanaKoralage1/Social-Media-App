import React, { useState } from "react";
import { FiHome, FiMessageCircle, FiBell, FiSearch, FiMenu, FiSun, FiMoon, FiLogOut, FiX } from "react-icons/fi";

const menuItems = [
  { name: "Explore", href: "/explore" },
  { name: "Top News", href: "#" },
  { name: "Verified", href: "#" },
  { name: "Accounts", href: "#" },
];

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Get profile image from localStorage or use a default
  let profileImg = "/default-profile.png";
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.profileImg) {
      profileImg = user.profileImg;
    }
  } catch (e) {}

  const handleThemeToggle = () => setDark((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b flex items-center justify-between px-4 py-2 shadow">
        <div className="flex gap-4 items-center">
          <a href="/home"><FiHome size={22} /></a>
          <a href="/profile">
            <img
              src={profileImg}
              alt="Profile"
              className="w-7 h-7 rounded-full object-cover border"
            />
          </a>
          <a href="/messages"><FiMessageCircle size={22} /></a>
          <a href="/notifications"><FiBell size={22} /></a>
          <button onClick={() => setShowSearch(true)}>
            <FiSearch size={22} />
          </button>
        </div>
        <button onClick={() => setMenuOpen(true)} className="p-2">
          <FiMenu size={26} />
        </button>
      </header>
      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-opacity-40 flex items-start justify-center pt-24" onClick={() => setShowSearch(false)}>
          <div
            className="bg-white w-11/12 max-w-md rounded shadow-lg p-4 flex items-center gap-2"
            onClick={e => e.stopPropagation()}
          >
            <input
              type="text"
              autoFocus
              placeholder="Search..."
              className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => setShowSearch(false)} className="p-2">
              <FiX size={22} />
            </button>
          </div>
        </div>
      )}
      {/* Hamburger Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-opacity-40 " onClick={() => setMenuOpen(false)}>
          <div
            className="absolute right-0 top-14 h-[calc(100vh-56px)] w-72 bg-white shadow-lg flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Theme Toggle in top right */}
            <div className="flex justify-end p-3">
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full bg-gray-100 hover:bg-blue-100 transition"
                title="Toggle theme"
              >
                {dark ? <FiSun size={20} color="orange" /> : <FiMoon size={20} />}
              </button>
            </div>
            {/* Menu Items */}
            <nav className="flex-1 flex flex-col gap-2 px-6">
              {menuItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  className="flex items-center gap-3 py-3 text-gray-700 hover:bg-blue-50 rounded transition font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </a>
              ))}
            </nav>
            {/* Logout Button */}
            <div className="p-6 border-t">
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition flex items-center justify-center gap-2"
              >
                <FiLogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;