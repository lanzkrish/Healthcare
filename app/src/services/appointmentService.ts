/**
 * Appointment API service
 */
import api from './api';
import { Appointment, CreateAppointmentData, ApiResponse } from '../types';

export const appointmentService = {
    getAll: async (status?: string): Promise<ApiResponse<Appointment[]>> => {
        const params = status ? { status } : {};
        const response = await api.get('/appointments', { params });
        return response.data;
    },

    getById: async (id: string): Promise<ApiResponse<Appointment>> => {
        const response = await api.get(`/appointments/${id}`);
        return response.data;
    },

    create: async (data: CreateAppointmentData): Promise<ApiResponse<Appointment>> => {
        const response = await api.post('/appointments', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Appointment>): Promise<ApiResponse<Appointment>> => {
        const response = await api.put(`/appointments/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/appointments/${id}`);
    },
};
