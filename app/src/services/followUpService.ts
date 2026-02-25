/**
 * Follow-up and Caregiver API services
 */
import api from './api';
import { FollowUp, CreateFollowUpData, ApiResponse } from '../types';

export const followUpService = {
    getAll: async (status?: string): Promise<ApiResponse<FollowUp[]>> => {
        const params = status ? { status } : {};
        const response = await api.get('/followups', { params });
        return response.data;
    },

    create: async (data: CreateFollowUpData): Promise<ApiResponse<FollowUp>> => {
        const response = await api.post('/followups', data);
        return response.data;
    },

    update: async (id: string, data: Partial<FollowUp>): Promise<ApiResponse<FollowUp>> => {
        const response = await api.put(`/followups/${id}`, data);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/followups/${id}`);
    },
};

export const caregiverService = {
    link: async (accessCode: string): Promise<ApiResponse<{ patientId: string; patientName: string }>> => {
        const response = await api.post('/caregiver/link', { accessCode });
        return response.data;
    },

    getLinkedPatient: async (): Promise<ApiResponse<{ name: string; email: string; phone: string }>> => {
        const response = await api.get('/caregiver/patient');
        return response.data;
    },

    getAccessCode: async (): Promise<ApiResponse<{ accessCode: string }>> => {
        const response = await api.get('/caregiver/access-code');
        return response.data;
    },
};
