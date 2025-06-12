import axios from 'axios';
import { BASE_URL } from './postService';

const API_URL = 'http://localhost:8080/api/posts';

export const createComment = async (postId, content, image) => {
    try {
        const formData = new FormData();
        formData.append('content', content);
        if (image) {
            formData.append('image', image);
        }

        const response = await axios.post(`${API_URL}/${postId}/comments`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        const data = response.data;
        console.log('Created comment:', data);
        return {
            ...data,
            imageUrl: data.imageUrl ? `${BASE_URL}/uploads/${data.imageUrl}` : null,
            user: {
                ...data.user,
                profileImage: data.user.profileImage
                    ? `${BASE_URL}/uploads/${data.user.profileImage}`
                    : null
            }
        };
    } catch (error) {
        console.error('Error creating comment:', error);
        throw error;
    }
};

export const getComments = async (postId) => {
    try {
        const response = await axios.get(`${API_URL}/${postId}/comments`);
        const data = response.data;
        console.log('Fetched comments:', data);
        return data.map(comment => ({
            ...comment,
            imageUrl: comment.imageUrl ? `${BASE_URL}/uploads/${comment.imageUrl}` : null,
            user: {
                ...comment.user,
                profileImage: comment.user.profileImage
                    ? `${BASE_URL}/uploads/${comment.user.profileImage}`
                    : null
            }
        }));
    } catch (error) {
        console.error('Error fetching comments:', error);
        throw error;
    }
};