import axios from 'axios';

const API_URL = 'http://localhost:8080/api/profile';
export const BASE_URL = 'http://localhost:8080';



// Add axios interceptor to handle token
axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export const getProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        const response = await axios.get(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = response.data;
        console.log('Raw profile response:', data);

        // Format the response data properly
        return {
            id: data.id,
            fullName: data.fullName,
            username: data.username,
            bio: data.bio,
            location: data.location,
            website: data.website,
            profileImage: data.profileImage ? `${BASE_URL}/uploads/${data.profileImage}` : null,
            backgroundImage: data.backgroundImage ? `${BASE_URL}/uploads/${data.backgroundImage}` : null,
            verified: data.verified
        };
    } catch (error) {
        console.error('Error fetching profile:', error);
        throw error;
    }
};

export const updateProfile = async (profileData) => {
    try {
        let config = {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        };

        if (profileData instanceof FormData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        } else {
            config.headers['Content-Type'] = 'application/json';
        }

        const response = await axios.put(`${API_URL}/update`, profileData, config);
        const data = response.data;
        console.log('Raw update response:', data); // Debug log
        const formattedData = {
            ...data,
            profileImage: data.profileImage ? `${BASE_URL}/uploads/${data.profileImage}` : null,
            backgroundImage: data.backgroundImage ? `${BASE_URL}/Uploads/${data.backgroundImage}` : null
        };
        console.log('Formatted update data:', formattedData); // Debug log
        return formattedData;
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
};