/**
 * Medication Store (Zustand)
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication, CreateMedicationData } from '../types';
import { medicationService } from '../services/medicationService';

interface MedicationState {
    medications: Medication[];
    isLoading: boolean;
    error: string | null;

    fetchMedications: () => Promise<void>;
    createMedication: (data: CreateMedicationData) => Promise<void>;
    updateMedication: (id: string, data: Partial<Medication>) => Promise<void>;
    deleteMedication: (id: string) => Promise<void>;
    markAsTaken: (id: string, time: string) => Promise<void>;
    loadCached: () => Promise<void>;
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
    medications: [],
    isLoading: false,
    error: null,

    fetchMedications: async () => {
        try {
            set({ isLoading: true, error: null });
            const response = await medicationService.getAll(true);
            await AsyncStorage.setItem('cached_medications', JSON.stringify(response.data));
            set({ medications: response.data, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    createMedication: async (data) => {
        try {
            set({ isLoading: true });
            const response = await medicationService.create(data);
            set((state) => ({
                medications: [...state.medications, response.data],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateMedication: async (id, data) => {
        try {
            const response = await medicationService.update(id, data);
            set((state) => ({
                medications: state.medications.map((m) =>
                    m._id === id ? response.data : m
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    deleteMedication: async (id) => {
        try {
            await medicationService.delete(id);
            set((state) => ({
                medications: state.medications.filter((m) => m._id !== id),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    markAsTaken: async (id, time) => {
        try {
            const response = await medicationService.markAsTaken(id, time);
            set((state) => ({
                medications: state.medications.map((m) =>
                    m._id === id ? response.data : m
                ),
            }));
        } catch (error: any) {
            set({ error: error.message });
        }
    },

    loadCached: async () => {
        try {
            const cached = await AsyncStorage.getItem('cached_medications');
            if (cached) set({ medications: JSON.parse(cached) });
        } catch { }
    },
}));
