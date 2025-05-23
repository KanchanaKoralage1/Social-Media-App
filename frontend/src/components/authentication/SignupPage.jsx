import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Paper, 
  Typography, 
  Container, 
  CircularProgress,
  Box 
} from '@mui/material';
import { signup } from '../../services/authService';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(formData);
      navigate('/home');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm" className="py-10">
      <Paper 
        elevation={6} 
        className="p-6 sm:p-8 bg-white rounded-3xl shadow-2xl transform transition-all duration-300 hover:shadow-[0_10px_30px_rgba(99,102,241,0.3)]"
        sx={{ 
          p: { xs: 4, sm: 8 }, 
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography 
          component="h1" 
          variant="h4" 
          className="font-extrabold text-gray-900 mb-6 tracking-tight transition-all duration-300 hover:scale-105"
          sx={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif' }}
        >
          Create Account
        </Typography>
        {error && (
          <Typography 
            color="error" 
            align="center" 
            className="mb-6 text-red-600 font-semibold bg-red-100/50 rounded-lg py-2 px-4 shadow-sm"
            sx={{ mb: 3 }}
          >
            {error}
          </Typography>
        )}
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          className="w-full space-y-6"
          sx={{ mt: 2 }}
        >
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
            className="rounded-2xl transition-all duration-200"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray.300' },
                '&:hover fieldset': { borderColor: '#111827', boxShadow: '0 0 8px rgba(17, 24, 39, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#111827', boxShadow: '0 0 12px rgba(17, 24, 39, 0.3)' },
                borderRadius: '1rem',
              },
              '& .MuiInputLabel-root': { color: 'gray.600' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#111827' },
              '& .MuiInputBase-input': { color: 'gray.900' },
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
            className="rounded-2xl transition-all duration-200"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray.300' },
                '&:hover fieldset': { borderColor: '#111827', boxShadow: '0 0 8px rgba(17, 24, 39, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#111827', boxShadow: '0 0 12px rgba(17, 24, 39, 0.3)' },
                borderRadius: '1rem',
              },
              '& .MuiInputLabel-root': { color: 'gray.600' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#111827' },
              '& .MuiInputBase-input': { color: 'gray.900' },
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
            className="rounded-2xl transition-all duration-200"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray.300' },
                '&:hover fieldset': { borderColor: '#111827', boxShadow: '0 0 8px rgba(17, 24, 39, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#111827', boxShadow: '0 0 12px rgba(17, 24, 39, 0.3)' },
                borderRadius: '1rem',
              },
              '& .MuiInputLabel-root': { color: 'gray.600' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#111827' },
              '& .MuiInputBase-input': { color: 'gray.900' },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="rounded-2xl transition-all duration-200"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: 'gray.300' },
                '&:hover fieldset': { borderColor: '#111827', boxShadow: '0 0 8px rgba(17, 24, 39, 0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#111827', boxShadow: '0 0 12px rgba(17, 24, 39, 0.3)' },
                borderRadius: '1rem',
              },
              '& .MuiInputLabel-root': { color: 'gray.600' },
              '& .MuiInputLabel-root.Mui-focused': { color: '#111827' },
              '& .MuiInputBase-input': { color: 'gray.900' },
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            className="mt-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-2xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgba(17,24,39,0.4)] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={loading}
            sx={{ 
              mt: 4, 
              mb: 2, 
              py: 1.75, 
              textTransform: 'none', 
              fontSize: '1.125rem',
              fontFamily: '"Inter", sans-serif',
              backgroundColor: '#111827',
              '&:hover': { backgroundColor: '#1f2937' },
            }}
          >
            {loading ? <CircularProgress size={24} className="text-white" /> : 'Sign Up'}
          </Button>
          <Typography 
            variant="body2" 
            align="center" 
            className="mt-4 text-gray-600"
            sx={{ mt: 3 }}
          >
            Already have an account?{' '}
            <Link 
              to="/login" 
              className="text-gray-900 hover:text-gray-800 font-semibold transition-all duration-300 hover:underline"
              style={{ textDecoration: 'none', color: '#111827' }}
            >
              Sign in here
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;