/**
 * Symptom API service
 */
import api from './api';
import { SymptomLog, CreateSymptomLogData, ApiResponse } from '../types';

export const symptomService = {
    getAll: async (startDate?: string, endDate?: string): Promise<ApiResponse<SymptomLog[]>> => {
        const params: Record<string, string> = {};
        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;
        const response = await api.get('/symptoms', { params });
        return response.data;
    },

    create: async (data: CreateSymptomLogData): Promise<ApiResponse<SymptomLog>> => {
        const response = await api.post('/symptoms', data);
        return response.data;
    },

    bulkSync: async (logs: CreateSymptomLogData[]): Promise<ApiResponse<SymptomLog[]>> => {
        const response = await api.post('/symptoms/bulk', { logs });
        return response.data;
    },
};
