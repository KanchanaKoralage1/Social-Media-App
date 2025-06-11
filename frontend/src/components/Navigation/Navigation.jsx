"use client"

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar, Button, Menu, MenuItem, Tooltip, Box } from "@mui/material"
import ProfileImage from "../../assets/profile.png"
import LogoutIcon from "@mui/icons-material/Logout"
import { logout } from "../../services/authService"
import { getProfile } from "../../services/profileService"
import { NavigationMenu } from "./NavigationMenu"

// Twitter logo SVG
const TwitterLogo = () => (
  <svg viewBox="0 0 24 24" width="28" height="28" fill="#1DA1F2">
    <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
  </svg>
)

function Navigation() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    profileImage: null,
  })
  const [activeItem, setActiveItem] = useState("Home")
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user) {
          setUserData((prev) => ({
            ...prev,
            username: user.username || "User",
            email: user.email || "user@example.com",
          }))
        }

        const profile = await getProfile()
        if (profile && profile.profileImage) {
          setUserData((prev) => ({
            ...prev,
            profileImage: profile.profileImage,
          }))
        }
      } catch (error) {
        console.error("Failed to fetch profile for navigation:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
    handleClose()
  }

  const handleNavigation = (item) => {
    setActiveItem(item.title)
    if (item.title === "Profile") {
      navigate(`/profile/${userData.username}`)
    } else {
      navigate(item.path)
    }
  }

  return (
    <Box className="h-screen flex flex-col py-2 px-2">
      {/* Logo */}
      <div className="mb-4 pl-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-blue-50 transition-colors duration-200 cursor-pointer">
          <TwitterLogo />
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 flex flex-col space-y-1">
        {NavigationMenu.map((item) => (
          <Tooltip title={item.title} placement="right" key={item.title}>
            <div
              className={`flex items-center px-3 py-3 rounded-full cursor-pointer transition-all duration-200 group ${
                activeItem === item.title ? "font-bold text-blue-500 bg-blue-50" : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => handleNavigation(item)}
            >
              <div className="mr-4 text-2xl">
                {React.cloneElement(item.icon, {
                  className: activeItem === item.title ? "text-blue-500" : "text-gray-700 group-hover:text-blue-500",
                  fontSize: "inherit",
                })}
              </div>
              <span className="text-xl">{item.title}</span>
            </div>
          </Tooltip>
        ))}

        {/* Tweet Button */}
        <div className="mt-6 px-3">
          <Button
            fullWidth
            variant="contained"
            className="normal-case text-lg py-3 rounded-full"
            sx={{
              py: 1.5,
              borderRadius: "9999px",
              textTransform: "none",
              fontSize: "1.1rem",
              fontWeight: 700,
              fontFamily:
                '"Chirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              backgroundColor: "#1DA1F2",
              boxShadow: "0 4px 6px -1px rgba(29, 161, 242, 0.4), 0 2px 4px -1px rgba(29, 161, 242, 0.2)",
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "#1a8cd8",
                boxShadow: "0 10px 15px -3px rgba(29, 161, 242, 0.4), 0 4px 6px -2px rgba(29, 161, 242, 0.2)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Tweet
          </Button>
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-auto mb-4 px-3">
        <div
          className="flex items-center p-3 rounded-full cursor-pointer hover:bg-gray-100 transition-all duration-200"
          onClick={handleClick}
        >
          <Avatar
            alt={userData.username}
            src={userData.profileImage || ProfileImage}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid #E5E7EB",
            }}
          />
          <div className="ml-3 mr-4 hidden md:block">
            <div className="font-bold text-gray-900 leading-tight">{userData.username}</div>
            <div className="text-gray-500 text-sm leading-tight truncate max-w-[120px]">{userData.email}</div>
          </div>
          <div className="ml-auto hidden md:block">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
            </svg>
          </div>
        </div>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          PaperProps={{
            elevation: 8,
            sx: {
              mt: -2,
              borderRadius: "16px",
              minWidth: "200px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              border: "1px solid rgba(0, 0, 0, 0.05)",
              "& .MuiList-root": {
                py: 1,
              },
            },
          }}
        >
          <MenuItem
            onClick={handleLogout}
            sx={{
              py: 1.5,
              px: 2,
              borderRadius: "8px",
              mx: 1,
              color: "#ef4444",
              fontWeight: 500,
              "&:hover": { backgroundColor: "rgba(239, 68, 68, 0.1)" },
            }}
          >
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            Logout
          </MenuItem>
        </Menu>
      </div>
    </Box>
  )
}

export default Navigation
