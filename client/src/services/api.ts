import axios from 'axios';
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

export const appointmentsApi = {

  findAll: async (): Promise<Appointment[]> => {
    const response = await api.get('/appointments');
    return response.data;
  },

  findOne: async (id: number): Promise<Appointment> => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (data: CreateAppointmentDto): Promise<Appointment> => {
    const response = await api.post('/appointments', data);
    return response.data;
  },

  update: async (id: number, data: UpdateAppointmentDto): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}`, data);
    return response.data;
  },

  cancel: async (id: number): Promise<Appointment> => {
    const response = await api.patch(`/appointments/${id}/cancel`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/appointments/${id}`);
  },
};