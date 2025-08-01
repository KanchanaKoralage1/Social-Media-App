import { Link } from "react-router-dom";

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Explore", href: "/explore" },
  { name: "Notification", href: "/notifications" },
  { name: "Message", href: "/messages" },
  { name: "Saved", href: "/saved" },
  { name: "Profile", href: "/profile" },
];

const Sidebar = ({ closeSidebar }) => {
  let user = { username: "User", email: "user@email.com" };
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored && stored.username && stored.email) {
      user = stored;
    }
  } catch (e) {
    // ignore parse errors, use default user
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col justify-between h-full w-64 bg-white border-r shadow-sm">
      <div>
        <div className="p-6 text-2xl font-bold text-blue-600 tracking-wide flex items-center justify-between">
          PathFinder
          {closeSidebar && (
            <button
              onClick={closeSidebar}
              className="md:hidden text-gray-500 ml-2"
            >
              ✕
            </button>
          )}
        </div>
        <nav className="mt-8 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded transition font-medium"
              onClick={closeSidebar}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-6 border-t flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-lg font-bold text-blue-700">
          {user.username ? user.username[0].toUpperCase() : "U"}
        </div>
        <div className="flex-1">
          <div className="font-semibold">{user.username || "User"}</div>
          <div className="text-xs text-gray-500">
            {user.email || "user@email.com"}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
