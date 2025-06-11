import { Box } from "@mui/material"
import { Route, Routes } from "react-router-dom"
import Navigation from "../Navigation/Navigation"
import HomeSection from "../middle section/HomeSection"
import RightSide from "../right section/RightSide"
import ProfilePage from "../profile/ProfilePage"
import TweetDetails from "../TweetDetails/TweetDetails"

function HomePage() {
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundColor: "white",
        display: "flex",
      }}
    >
      {/* Desktop Layout */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Left Navigation - Fixed width */}
        <Box
          sx={{
            width: "280px",
            minWidth: "280px",
            height: "100vh",
            borderRight: "1px solid #EFF3F4",
            backgroundColor: "white",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              overflowY: "auto",
              overflowX: "hidden",
              px: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#A0AEC0",
              },
            }}
          >
            <Navigation />
          </Box>
        </Box>

        {/* Middle Content - Flexible width, centered */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            height: "100vh",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "600px",
              height: "100vh",
              borderLeft: "1px solid #EFF3F4",
              borderRight: "1px solid #EFF3F4",
              backgroundColor: "white",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                height: "100vh",
                overflowY: "auto",
                overflowX: "hidden",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#CBD5E0",
                  borderRadius: "3px",
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  background: "#A0AEC0",
                },
              }}
            >
              <Routes>
                <Route path="/" element={<HomeSection />} />
                <Route path="/home" element={<HomeSection />} />
                <Route path="/profile/:id" element={<ProfilePage />} />
                <Route path="/tweet/:id" element={<TweetDetails />} />
              </Routes>
            </Box>
          </Box>
        </Box>

        {/* Right Side - Fixed width, positioned at right corner */}
        <Box
          sx={{
            width: "350px",
            minWidth: "350px",
            height: "100vh",
            borderLeft: "1px solid #EFF3F4",
            backgroundColor: "white",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              overflowY: "auto",
              overflowX: "hidden",
              px: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#A0AEC0",
              },
            }}
          >
            <RightSide />
          </Box>
        </Box>
      </Box>

      {/* Tablet Layout */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex", lg: "none" },
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Tablet Navigation */}
        <Box
          sx={{
            width: "240px",
            minWidth: "240px",
            height: "100vh",
            borderRight: "1px solid #EFF3F4",
            backgroundColor: "white",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              overflowY: "auto",
              overflowX: "hidden",
              px: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#A0AEC0",
              },
            }}
          >
            <Navigation />
          </Box>
        </Box>

        {/* Tablet Content */}
        <Box
          sx={{
            flex: 1,
            height: "100vh",
            borderLeft: "1px solid #EFF3F4",
            borderRight: "1px solid #EFF3F4",
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#A0AEC0",
              },
            }}
          >
            <Routes>
              <Route path="/" element={<HomeSection />} />
              <Route path="/home" element={<HomeSection />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/tweet/:id" element={<TweetDetails />} />
            </Routes>
          </Box>
        </Box>

        {/* Tablet Right Side */}
        <Box
          sx={{
            width: "300px",
            minWidth: "300px",
            height: "100vh",
            borderLeft: "1px solid #EFF3F4",
            backgroundColor: "white",
            zIndex: 10,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              overflowY: "auto",
              overflowX: "hidden",
              px: 2,
              "&::-webkit-scrollbar": {
                width: "6px",
              },
              "&::-webkit-scrollbar-track": {
                background: "transparent",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#CBD5E0",
                borderRadius: "3px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                background: "#A0AEC0",
              },
            }}
          >
            <RightSide />
          </Box>
        </Box>
      </Box>

      {/* Mobile Layout */}
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        {/* Mobile Content */}
        <Box
          sx={{
            flex: 1,
            height: "calc(100vh - 60px)",
            backgroundColor: "white",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              height: "100%",
              overflowY: "auto",
              overflowX: "hidden",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            <Routes>
              <Route path="/" element={<HomeSection />} />
              <Route path="/home" element={<HomeSection />} />
              <Route path="/profile/:id" element={<ProfilePage />} />
              <Route path="/tweet/:id" element={<TweetDetails />} />
            </Routes>
          </Box>
        </Box>

        {/* Mobile Bottom Navigation */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60px",
            backgroundColor: "white",
            borderTop: "1px solid #EFF3F4",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(29, 161, 242, 0.1)",
              },
            }}
          >
            <Box sx={{ fontSize: "24px", color: "#1DA1F2" }}>🏠</Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(83, 100, 113, 0.1)",
              },
            }}
          >
            <Box sx={{ fontSize: "24px", color: "#536471" }}>🔍</Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(83, 100, 113, 0.1)",
              },
            }}
          >
            <Box sx={{ fontSize: "24px", color: "#536471" }}>🔔</Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "background-color 0.2s",
              "&:hover": {
                backgroundColor: "rgba(83, 100, 113, 0.1)",
              },
            }}
          >
            <Box sx={{ fontSize: "24px", color: "#536471" }}>✉️</Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
