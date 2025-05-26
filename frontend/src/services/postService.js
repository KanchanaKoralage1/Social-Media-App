import axios from 'axios';

const API_URL = 'http://localhost:8080/api/posts';
export const BASE_URL = 'http://localhost:8080';

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

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.error('Unauthorized, redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const createPost = async (content, images) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        if (images) {
            Array.from(images).forEach(image => {
                formData.append('images', image);
            });
        }

        const response = await axios.post(API_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const data = response.data;
        console.log('Created post:', data);
        return {
            ...data,
            imageUrl: data.imageUrl
                ? data.imageUrl.split(',').map(url => `${BASE_URL}/uploads/${url}`)
                : []
        };
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

export const getAllPosts = async () => {
    try {
        const response = await axios.get(API_URL);
        const data = response.data;
        console.log('Fetched posts:', data);
        return data.map(post => ({
            ...post,
            imageUrl: post.imageUrl
                ? post.imageUrl.split(',').map(url => `${BASE_URL}/uploads/${url}`)
                : [],
            user: {
                ...post.user,
                profileImage: post.user.profileImage
                    ? `${BASE_URL}/uploads/${post.user.profileImage}`
                    : null
            }
        }));
    } catch (error) {
        console.error('Error fetching posts:', error);
        throw error;
    }
};

export const getUserPosts = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/user/${userId}`);
        const data = response.data;
        console.log('Fetched user posts:', data);
        return data.map(post => ({
            ...post,
            imageUrl: post.imageUrl
                ? post.imageUrl.split(',').map(url => `${BASE_URL}/uploads/${url}`)
                : [],
            user: {
                ...post.user,
                profileImage: post.user.profileImage
                    ? `${BASE_URL}/uploads/${post.user.profileImage}`
                    : null
            }
        }));
    } catch (error) {
        console.error('Error fetching user posts:', error);
        throw error;
    }
};

export const deletePost = async (postId) => {
    try {
        await axios.delete(`${API_URL}/${postId}`);
        console.log('Deleted post:', postId);
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};