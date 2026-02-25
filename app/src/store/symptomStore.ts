/**
 * Symptom Store (Zustand)
 * Handles symptom logs with offline-first approach
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SymptomLog, CreateSymptomLogData } from '../types';
import { symptomService } from '../services/symptomService';

interface SymptomState {
    logs: SymptomLog[];
    offlineLogs: CreateSymptomLogData[];
    isLoading: boolean;
    error: string | null;

    fetchLogs: () => Promise<void>;
    createLog: (data: CreateSymptomLogData) => Promise<void>;
    createOfflineLog: (data: CreateSymptomLogData) => Promise<void>;
    syncOfflineLogs: () => Promise<void>;
}

export const useSymptomStore = create<SymptomState>((set, get) => ({
    logs: [],
    offlineLogs: [],
    isLoading: false,
    error: null,

    fetchLogs: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await symptomService.getAll();
            set({ logs: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    createLog: async (data) => {
        try {
            set({ isLoading: true });
            const response = await symptomService.create(data);
            set((state) => ({
                logs: [response.data, ...state.logs],
                isLoading: false,
            }));
        } catch {
            // If network fails, save offline
            await get().createOfflineLog(data);
            set({ isLoading: false });
        }
    },

    createOfflineLog: async (data) => {
        const offlineLogs = [...get().offlineLogs, data];
        await AsyncStorage.setItem('offline_symptom_logs', JSON.stringify(offlineLogs));
        set({ offlineLogs });
    },

    syncOfflineLogs: async () => {
        const { offlineLogs } = get();
        if (offlineLogs.length === 0) return;

        try {
            const response = await symptomService.bulkSync(offlineLogs);
            await AsyncStorage.removeItem('offline_symptom_logs');
            set((state) => ({
                logs: [...response.data, ...state.logs],
                offlineLogs: [],
            }));
        } catch { }
    },
}));
