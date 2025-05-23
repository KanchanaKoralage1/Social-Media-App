import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/signup`, userData);
    if (response.data.token) {
      const userToStore = {
        username: response.data.username,
        email: userData.email // Store email from signup form
      };
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userToStore));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      usernameOrEmail: credentials.usernameOrEmail,
      password: credentials.password
    });
    if (response.data.token) {
      // Make another request to get user details
      const userDetails = await axios.get(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${response.data.token}`
        }
      });
      
      const userToStore = {
        username: response.data.username,
        email: userDetails.data.email || credentials.usernameOrEmail
      };
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userToStore));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};