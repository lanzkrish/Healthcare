/**
 * Auth API service
 */
import api from './api';
import { AuthResponse, TokenRefreshResponse, User, ApiResponse } from '../types';

export const authService = {
    register: async (data: {
        name: string;
        email: string;
        phone?: string;
        password: string;
        role: string;
    }): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<TokenRefreshResponse> => {
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    },

    getMe: async (): Promise<ApiResponse<User>> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    updateProfile: async (data: Partial<User>): Promise<ApiResponse<User>> => {
        const response = await api.put('/auth/profile', data);
        return response.data;
    },

    updatePushToken: async (expoPushToken: string): Promise<void> => {
        await api.put('/auth/push-token', { expoPushToken });
    },
};
