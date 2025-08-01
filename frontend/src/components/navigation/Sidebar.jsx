"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "Explore", href: "/explore" },
  { name: "Notification", href: "/notifications" },
  { name: "Message", href: "/messages" },
  { name: "Saved", href: "/saved" },
  { name: "Profile", href: "/profile" },
]

const Sidebar = ({ closeSidebar }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    username: "User",
    email: "user@email.com",
    profileImage: null,
  })
  const [loading, setLoading] = useState(true)

  // Helper function to construct the full image URL
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null
    return imagePath.startsWith("http") ? imagePath : `http://localhost:8080/uploads/${imagePath}`
  }

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true)
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found, redirecting to login")
          navigate("/login")
          return
        }
        const res = await fetch("http://localhost:8080/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        console.log("Profile API response status:", res.status)
        if (res.ok) {
          const data = await res.json()
          console.log("Profile API response data:", data)
          setUser({
            username: data.username || "User",
            email: data.email || "user@email.com",
            profileImage: getFullImageUrl(data.profileImage),
          })
          // Store only the relative path in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              username: data.username,
              email: data.email,
              profileImage: data.profileImage, // Store relative path
            }),
          )
        } else {
          console.error(`Failed to fetch profile: ${res.status} ${res.statusText}`)
          navigate("/login")
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        navigate("/login")
      }
      setLoading(false)
    }

    try {
      const stored = JSON.parse(localStorage.getItem("user"))
      if (stored && stored.username && stored.email) {
        setUser({
          username: stored.username,
          email: stored.email,
          profileImage: getFullImageUrl(stored.profileImage), // Use helper for stored image
        })
        fetchUserProfile() // Also fetch latest from API
      } else {
        fetchUserProfile()
      }
    } catch (e) {
      fetchUserProfile()
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <div className="flex flex-col justify-between h-full w-64 bg-white border-r shadow-sm">
      <div>
        <div className="p-6 text-2xl font-bold text-blue-600 tracking-wide flex items-center justify-between">
          PathFinder
          {closeSidebar && (
            <button onClick={closeSidebar} className="md:hidden text-gray-500 ml-2">
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
        {loading ? (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
        ) : (
          <img
            src={user.profileImage || "/default-profile.png"}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-300 dark:border-gray-600"
          />
        )}
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white">{loading ? "Loading..." : user.username}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{loading ? "Loading..." : user.email}</div>
        </div>
        <button
          onClick={handleLogout}
          className="ml-2 px-3 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar
