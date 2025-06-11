"use client"

import React from "react"
import { Button, InputBase, Paper, Avatar, Box } from "@mui/material"
import VerifiedIcon from "@mui/icons-material/Verified"
import SubscriptionModal from "../subscription/SubscriptionModal"

// Custom Search Icon
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M21 21L15.0001 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
      stroke="#536471"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Custom Theme Icon
const ThemeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"
      stroke="#536471"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M4.93 19.07L6.34 17.66M17.66 6.34L19.07 4.93"
      stroke="#536471"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// Custom More Icon
const MoreIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
      stroke="#536471"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
      stroke="#536471"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
      stroke="#536471"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function RightSide() {
  const [openSubscriptionModal, setOpenSubscriptionModal] = React.useState(false)
  const handleOpenSubscriptionModal = () => setOpenSubscriptionModal(true)
  const handleCloseSubscriptionModal = () => setOpenSubscriptionModal(false)

  const handleChangeTheme = () => {
    console.log("change theme")
  }

  const trendingTopics = [
    { category: "Technology", topic: "React 19", tweets: "45.2K" },
    { category: "Sports", topic: "World Cup", tweets: "128K" },
    { category: "Entertainment", topic: "New Movie", tweets: "67.8K" },
    { category: "Politics", topic: "Election 2024", tweets: "234K" },
  ]

  const whoToFollow = [
    {
      name: "Jane Cooper",
      username: "@jane_cooper",
      avatar: "https://randomuser.me/api/portraits/women/10.jpg",
    },
    {
      name: "Wade Warren",
      username: "@wade_warren",
      avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    },
    {
      name: "Esther Howard",
      username: "@esther_howard",
      avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    },
  ]

  return (
    <Box sx={{ py: 3, px: 3, maxWidth: "350px" }}>
      {/* Search Bar */}
      <Box sx={{ position: "relative", mb: 4 }}>
        <Box
          sx={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
            zIndex: 1,
          }}
        >
          <SearchIcon />
        </Box>
        <InputBase
          placeholder="Search Twitter"
          sx={{
            width: "100%",
            fontSize: "15px",
            fontWeight: 400,
            backgroundColor: "#EFF3F4",
            borderRadius: "9999px",
            transition: "all 0.2s",
            "& .MuiInputBase-input": {
              padding: "12px 48px 12px 48px",
              "&::placeholder": {
                color: "#536471",
                opacity: 1,
              },
            },
            "&:focus-within": {
              backgroundColor: "#FFFFFF",
              boxShadow: "0 0 0 1px #1DA1F2, 0 0 0 4px rgba(29, 161, 242, 0.2)",
            },
          }}
          endAdornment={
            <Button
              onClick={handleChangeTheme}
              sx={{
                position: "absolute",
                right: 8,
                minWidth: "auto",
                p: 1,
                borderRadius: "50%",
                color: "#536471",
                "&:hover": {
                  backgroundColor: "rgba(29, 161, 242, 0.1)",
                  color: "#1DA1F2",
                },
              }}
            >
              <ThemeIcon />
            </Button>
          }
        />
      </Box>

      {/* Get Verified Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          backgroundColor: "#F7F9FA",
          border: "1px solid #EFF3F4",
          mb: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4 }}>
          <Box sx={{ fontSize: "20px", fontWeight: 800, color: "#0F1419", mb: 2 }}>Get Verified</Box>
          <Box sx={{ color: "#536471", mb: 3, fontSize: "15px", lineHeight: 1.4 }}>
            Subscribe to unlock new features and get the blue checkmark
          </Box>
          <Button
            onClick={handleOpenSubscriptionModal}
            variant="contained"
            startIcon={<VerifiedIcon />}
            sx={{
              borderRadius: "9999px",
              py: 1.5,
              px: 4,
              textTransform: "none",
              fontSize: "15px",
              fontWeight: 700,
              backgroundColor: "#1DA1F2",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#1a8cd8",
                boxShadow: "0 4px 6px -1px rgba(29, 161, 242, 0.1)",
              },
            }}
          >
            Get Verified
          </Button>
        </Box>
      </Paper>

      {/* Trending Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          backgroundColor: "#F7F9FA",
          border: "1px solid #EFF3F4",
          mb: 4,
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 4, py: 3, borderBottom: "1px solid #EFF3F4" }}>
          <Box sx={{ fontSize: "20px", fontWeight: 800, color: "#0F1419" }}>Trends for you</Box>
        </Box>

        {trendingTopics.map((item, index) => (
          <Box
            key={index}
            sx={{
              px: 4,
              py: 3,
              cursor: "pointer",
              transition: "background-color 0.2s",
              borderBottom: index < trendingTopics.length - 1 ? "1px solid #EFF3F4" : "none",
              "&:hover": {
                backgroundColor: "rgba(15, 20, 25, 0.03)",
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ fontSize: "13px", color: "#536471", mb: 0.5 }}>{item.category} · Trending</Box>
                <Box sx={{ fontWeight: 700, color: "#0F1419", mb: 0.5, fontSize: "15px" }}>{item.topic}</Box>
                <Box sx={{ fontSize: "13px", color: "#536471" }}>{item.tweets} Tweets</Box>
              </Box>
              <Button
                sx={{
                  minWidth: "auto",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  color: "#536471",
                  "&:hover": {
                    backgroundColor: "rgba(29, 161, 242, 0.1)",
                    color: "#1DA1F2",
                  },
                }}
              >
                <MoreIcon />
              </Button>
            </Box>
          </Box>
        ))}

        <Box
          sx={{
            px: 4,
            py: 3,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "rgba(15, 20, 25, 0.03)",
            },
          }}
        >
          <Box sx={{ color: "#1DA1F2", fontSize: "15px", fontWeight: 500 }}>Show more</Box>
        </Box>
      </Paper>

      {/* Who to follow */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          backgroundColor: "#F7F9FA",
          border: "1px solid #EFF3F4",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 4, py: 3, borderBottom: "1px solid #EFF3F4" }}>
          <Box sx={{ fontSize: "20px", fontWeight: 800, color: "#0F1419" }}>Who to follow</Box>
        </Box>

        {whoToFollow.map((user, index) => (
          <Box
            key={index}
            sx={{
              px: 4,
              py: 3,
              cursor: "pointer",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottom: index < whoToFollow.length - 1 ? "1px solid #EFF3F4" : "none",
              "&:hover": {
                backgroundColor: "rgba(15, 20, 25, 0.03)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
              <Avatar src={user.avatar} alt={user.name} sx={{ width: 40, height: 40, mr: 3 }} />
              <Box>
                <Box
                  sx={{
                    fontWeight: 700,
                    color: "#0F1419",
                    fontSize: "15px",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  {user.name}
                </Box>
                <Box sx={{ color: "#536471", fontSize: "15px" }}>{user.username}</Box>
              </Box>
            </Box>
            <Button
              variant="contained"
              sx={{
                borderRadius: "9999px",
                py: 1,
                px: 3,
                minWidth: "auto",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 700,
                backgroundColor: "#0F1419",
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#272C30",
                },
              }}
            >
              Follow
            </Button>
          </Box>
        ))}

        <Box
          sx={{
            px: 4,
            py: 3,
            cursor: "pointer",
            transition: "background-color 0.2s",
            "&:hover": {
              backgroundColor: "rgba(15, 20, 25, 0.03)",
            },
          }}
        >
          <Box sx={{ color: "#1DA1F2", fontSize: "15px", fontWeight: 500 }}>Show more</Box>
        </Box>
      </Paper>

      <SubscriptionModal open={openSubscriptionModal} handleClose={handleCloseSubscriptionModal} />
    </Box>
  )
}

export default RightSide
