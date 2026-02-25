/**
 * Auth Store (Zustand)
 * Manages user authentication state, token storage, and session persistence
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<void>;
    register: (data: { name: string; email: string; phone?: string; password: string; role: UserRole }) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    clearError: () => void;
    updateProfile: (data: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email, password) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authService.login({ email, password });
            const { user, accessToken, refreshToken } = response.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    register: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await authService.register(data);
            const { user, accessToken, refreshToken } = response.data;

            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('refreshToken', refreshToken);
            await AsyncStorage.setItem('user', JSON.stringify(user));

            set({ user, isAuthenticated: true, isLoading: false });
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed';
            set({ error: message, isLoading: false });
            throw new Error(message);
        }
    },

    logout: async () => {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
        set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    },

    loadUser: async () => {
        try {
            set({ isLoading: true });
            const userStr = await AsyncStorage.getItem('user');
            const token = await AsyncStorage.getItem('accessToken');

            if (userStr && token) {
                const user = JSON.parse(userStr);
                set({ user, isAuthenticated: true, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch {
            set({ isLoading: false });
        }
    },

    clearError: () => set({ error: null }),

    updateProfile: async (data) => {
        try {
            const response = await authService.updateProfile(data);
            const updatedUser = response.data;
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            set({ user: updatedUser });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Update failed' });
        }
    },
}));
