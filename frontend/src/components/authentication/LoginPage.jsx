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
  Divider,
  InputAdornment,
  IconButton,
} from "@mui/material"
import EmailIcon from "@mui/icons-material/Email"
import LockIcon from "@mui/icons-material/Lock"
import VisibilityIcon from "@mui/icons-material/Visibility"
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff"
import TwitterIcon from "@mui/icons-material/Twitter"
import { login, loginWithGoogle } from "../../services/authService"

// Custom Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
)

const LoginPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
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
      await login(formData)
      navigate("/home")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const response = await loginWithGoogle()
      if (response.success) {
        navigate("/home")
      }
    } catch (err) {
      setError("Google login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
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
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400 to-red-500 rounded-full opacity-10 transform -translate-x-12 translate-y-12"></div>

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
                <TwitterIcon sx={{ fontSize: 32, color: "white" }} />
              </div>
              <Typography
                component="h1"
                variant="h4"
                className="font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-2"
                sx={{ fontFamily: '"Inter", sans-serif' }}
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" className="text-gray-600" sx={{ fontFamily: '"Inter", sans-serif' }}>
                Sign in to continue to your account
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
            <Box component="form" onSubmit={handleSubmit} className="space-y-6">
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email or Username"
                name="usernameOrEmail"
                autoComplete="email"
                autoFocus
                value={formData.usernameOrEmail}
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
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                    fontFamily: '"Inter", sans-serif',
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#3b82f6",
                      borderWidth: "2px",
                      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#6b7280",
                    fontFamily: '"Inter", sans-serif',
                  },
                  "& .MuiInputLabel-root.Mui-focused": { color: "#3b82f6" },
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
                  background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    background: "linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)",
                    boxShadow: "0 15px 35px -5px rgba(59, 130, 246, 0.5)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "#e5e7eb",
                    color: "#9ca3af",
                    boxShadow: "none",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Sign In"}
              </Button>

              <Divider sx={{ my: 3 }}>
                <Typography variant="body2" sx={{ color: "#6b7280", fontFamily: '"Inter", sans-serif' }}>
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                onClick={handleGoogleLogin}
                disabled={loading}
                startIcon={<GoogleIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 500,
                  fontFamily: '"Inter", sans-serif',
                  borderColor: "#e5e7eb",
                  color: "#374151",
                  backgroundColor: "#ffffff",
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    borderColor: "#d1d5db",
                    backgroundColor: "#f9fafb",
                    boxShadow: "0 4px 12px -2px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Continue with Google
              </Button>

              <div className="text-center mt-6">
                <Typography variant="body2" sx={{ color: "#6b7280", fontFamily: '"Inter", sans-serif' }}>
                  Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200"
                    style={{ textDecoration: "none" }}
                  >
                    Sign up here
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

export default LoginPage
