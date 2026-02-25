/**
 * Medication API service
 */
import api from './api';
import { Medication, CreateMedicationData, ApiResponse } from '../types';

export const medicationService = {
    getAll: async (active?: boolean): Promise<ApiResponse<Medication[]>> => {
        const params = active !== undefined ? { active: String(active) } : {};
        const response = await api.get('/medications', { params });
        return response.data;
    },

    create: async (data: CreateMedicationData): Promise<ApiResponse<Medication>> => {
        const response = await api.post('/medications', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Medication>): Promise<ApiResponse<Medication>> => {
        const response = await api.put(`/medications/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/medications/${id}`);
    },

    markAsTaken: async (id: string, time: string, taken: boolean = true): Promise<ApiResponse<Medication>> => {
        const response = await api.post(`/medications/${id}/taken`, {
            date: new Date().toISOString(),
            time,
            taken,
        });
        return response.data;
    },
};
