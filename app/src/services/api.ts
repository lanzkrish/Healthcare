/**
 * Axios API client with interceptors for JWT token management
 * Handles automatic token refresh on 401 responses
 */
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── API Base URL Configuration ──────────────────────────────
// For LOCAL development: use your computer's LAN IP
// For RENDER production: use your Render URL
const API_BASE_URL = __DEV__
    ? 'http://192.168.31.28:5020/api'       // 👈 Local dev: your computer's IP
    : 'https://healthcare-gclg.onrender.com/api'; // 👈 Production: Render deploy

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor: attach access token to every request
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem('accessToken');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: handle token refresh on 401
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If token expired and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                // Store new tokens
                await AsyncStorage.setItem('accessToken', data.data.accessToken);
                await AsyncStorage.setItem('refreshToken', data.data.refreshToken);

                // Retry original request with new token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                // Clear tokens and let auth store handle logout
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
                await AsyncStorage.removeItem('user');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
