"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  CircularProgress,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material"
import PersonIcon from "@mui/icons-material/Person"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import TwitterIcon from "@mui/icons-material/Twitter"
import { signup } from "../../services/authService"

const SignupPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signup(formData)
      navigate("/home")
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          className="relative overflow-hidden"
          sx={{
            p: { xs: 4, sm: 6 },
            borderRadius: "24px",
            background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          }}
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full opacity-10 transform -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-cyan-500 rounded-full opacity-10 transform translate-x-12 translate-y-12"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg">
                <TwitterIcon sx={{ fontSize: 32, color: "white" }} />
              </div>
              <Typography
                component="h1"
                variant="h4"
                className="font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              >
                Create Account
              </Typography>
              <Typography variant="body1" className="text-gray-600" sx={{ fontFamily: '"Inter", sans-serif' }}>
                Join us today and start sharing your thoughts
              </Typography>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <Typography
                  color="error"
                  align="center"
                  className="text-red-700 font-medium"
                  sx={{ fontSize: "0.875rem" }}
                >
                  {error}
                </Typography>
              </div>
            )}

            {/* Form */}
            <Box component="form" onSubmit={handleSubmit} className="space-y-4">
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="fullName"
                autoFocus
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    transition: "all 0.2s ease-in-out",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                    fontFamily: '"Inter", sans-serif',
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountCircleIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    transition: "all 0.2s ease-in-out",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                    fontFamily: '"Inter", sans-serif',
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    transition: "all 0.2s ease-in-out",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                    fontFamily: '"Inter", sans-serif',
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#6b7280" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: "#6b7280" }}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f9fafb",
                    transition: "all 0.2s ease-in-out",
                    "& fieldset": {
                      borderColor: "#e5e7eb",
                      borderWidth: "1px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#8b5cf6",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#8b5cf6",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(139, 92, 246, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                    fontFamily: '"Inter", sans-serif',
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#8b5cf6" },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  fontFamily: '"Inter", sans-serif',
                  background: "linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)",
                  boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.4)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
                    boxShadow: "0 15px 35px -5px rgba(139, 92, 246, 0.5)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "#e5e7eb",
                    color: "#9ca3af",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Create Account"}
              </Button>

              <div className="text-center mt-6">
                <Typography variant="body2" sx={{ color: "#6b7280", fontFamily: '"Inter", sans-serif' }}>
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-purple-600 hover:text-purple-500 transition-colors duration-200"
                    style={{ textDecoration: "none" }}
                  >
                    Sign in here
                  </Link>
                </Typography>
              </div>
            </Box>
          </div>
        </Paper>
      </Container>
    </div>
  )
}

export default SignupPage
