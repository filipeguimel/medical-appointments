import { useState, useEffect } from 'react';
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment';
import { appointmentsApi } from '@/services/api';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await appointmentsApi.findAll();
      setAppointments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar consultas');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (data: CreateAppointmentDto) => {
    try {
      setLoading(true);
      setError(null);
      const newAppointment = await appointmentsApi.create(data);
      setAppointments(prev => [...prev, newAppointment]);
      return newAppointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao criar consulta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async (id: number, data: UpdateAppointmentDto) => {
    try {
      setLoading(true);
      setError(null);
      const updatedAppointment = await appointmentsApi.update(id, data);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? updatedAppointment : appointment
        )
      );
      return updatedAppointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar consulta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const canceledAppointment = await appointmentsApi.cancel(id);
      setAppointments(prev => 
        prev.map(appointment => 
          appointment.id === id ? canceledAppointment : appointment
        )
      );
      return canceledAppointment;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao cancelar consulta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteAppointment = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await appointmentsApi.delete(id);
      setAppointments(prev => prev.filter(appointment => appointment.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao deletar consulta';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  };
};