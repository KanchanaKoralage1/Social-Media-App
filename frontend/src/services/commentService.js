import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const createComment = async (postId, content, image) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const response = await axios.post(
            `${BASE_URL}/posts/${postId}/comments`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

export const getComments = async (postId) => {
    try {
        const response = await axios.get(
            `${BASE_URL}/posts/${postId}/comments`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};