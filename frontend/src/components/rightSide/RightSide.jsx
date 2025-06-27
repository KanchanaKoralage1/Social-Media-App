import React, { useState } from "react";

const newsList = [
  { title: "React 19 Released!", link: "#" },
  { title: "Spring Boot 3.2 Announced", link: "#" },
  { title: "AI is transforming social media", link: "#" },
];

const suggestions = [
  { username: "john_doe", name: "John Doe" },
  { username: "jane_smith", name: "Jane Smith" },
  { username: "dev_guru", name: "Dev Guru" },
];

const RightSide = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [dark, setDark] = useState(false);

  const handleThemeToggle = () => setDark((prev) => !prev);

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden fixed top-4 right-4 z-30">
        <button
          onClick={() => setShowSidebar(true)}
          className="p-2 rounded bg-blue-600 text-white"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      {/* Sidebar overlay for mobile */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40" onClick={() => setShowSidebar(false)}>
          <div
            className={`absolute right-0 top-0 h-full w-80 bg-white dark:bg-gray-900 shadow-lg transition-all`}
            onClick={(e) => e.stopPropagation()}
          >
            <RightSideContent
              dark={dark}
              handleThemeToggle={handleThemeToggle}
              closeSidebar={() => setShowSidebar(false)}
            />
          </div>
        </div>
      )}
      {/* Sidebar for desktop */}
      <div className="hidden md:block w-80">
        <div className={`h-screen sticky top-0 bg-white dark:bg-gray-900 border-l`}>
          <RightSideContent dark={dark} handleThemeToggle={handleThemeToggle} />
        </div>
      </div>
    </>
  );
};

const RightSideContent = ({ dark, handleThemeToggle, closeSidebar }) => (
  <div className="flex flex-col h-full p-4 space-y-6">
    {/* 1. Search + Theme Toggle */}
    <div className="flex items-center gap-2">
      <input
        type="text"
        placeholder="Search..."
        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
      />
      <button
        onClick={handleThemeToggle}
        className="ml-2 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        title="Toggle theme"
      >
        {dark ? (
          // Sun icon for light mode
          <svg width="20" height="20" fill="none" stroke="orange" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" strokeWidth="2" />
            <path strokeWidth="2" d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.66 17.66l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.66 6.34l1.42-1.42" />
          </svg>
        ) : (
          // Moon icon for dark mode
          <svg width="20" height="20" fill="none" stroke="black" viewBox="0 0 24 24">
            <path strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
          </svg>
        )}
      </button>
      {closeSidebar && (
        <button onClick={closeSidebar} className="ml-2 md:hidden text-gray-500 text-xl">
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
      <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">Top News</h3>
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
    <div>
      <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-200">Who to follow</h3>
      <ul className="space-y-2">
        {suggestions.map((s, idx) => (
          <li key={idx} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.name}</div>
              <div className="text-xs text-gray-500">@{s.username}</div>
            </div>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition">
              Follow
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default RightSide;