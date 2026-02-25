/**
 * Appointment Store (Zustand)
 * Manages appointment data with optimistic updates and local caching
 */
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appointment, CreateAppointmentData } from '../types';
import { appointmentService } from '../services/appointmentService';

interface AppointmentState {
    appointments: Appointment[];
    isLoading: boolean;
    error: string | null;

    fetchAppointments: (status?: string) => Promise<void>;
    createAppointment: (data: CreateAppointmentData) => Promise<void>;
    updateAppointment: (id: string, data: Partial<Appointment>) => Promise<void>;
    deleteAppointment: (id: string) => Promise<void>;
    loadCached: () => Promise<void>;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
    appointments: [],
    isLoading: false,
    error: null,

    fetchAppointments: async (status) => {
        try {
            set({ isLoading: true, error: null });
            const response = await appointmentService.getAll(status);
            const appointments = response.data;
            // Cache for offline access
            await AsyncStorage.setItem('cached_appointments', JSON.stringify(appointments));
            set({ appointments, isLoading: false });
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
        }
    },

    createAppointment: async (data) => {
        try {
            set({ isLoading: true, error: null });
            const response = await appointmentService.create(data);
            set((state) => ({
                appointments: [...state.appointments, response.data],
                isLoading: false,
            }));
        } catch (error: any) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    updateAppointment: async (id, data) => {
        // Optimistic update
        const previous = get().appointments;
        set((state) => ({
            appointments: state.appointments.map((a) =>
                a._id === id ? { ...a, ...data } : a
            ),
        }));
        try {
            await appointmentService.update(id, data);
        } catch (error: any) {
            // Revert on failure
            set({ appointments: previous, error: error.message });
        }
    },

    deleteAppointment: async (id) => {
        const previous = get().appointments;
        set((state) => ({
            appointments: state.appointments.filter((a) => a._id !== id),
        }));
        try {
            await appointmentService.delete(id);
        } catch (error: any) {
            set({ appointments: previous, error: error.message });
        }
    },

    loadCached: async () => {
        try {
            const cached = await AsyncStorage.getItem('cached_appointments');
            if (cached) set({ appointments: JSON.parse(cached) });
        } catch { }
    },
}));
