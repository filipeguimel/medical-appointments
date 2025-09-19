import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { CreateAppointmentDto, UpdateAppointmentDto, Appointment } from '@/types/appointment';
import { format } from 'date-fns';

const appointmentSchema = z.object({
  patientName: z.string()
    .min(3, 'Nome do paciente deve ter pelo menos 3 caracteres')
    .nonempty('Nome do paciente é obrigatório'),
  doctorName: z.string()
    .min(3, 'Nome do médico deve ter pelo menos 3 caracteres')
    .nonempty('Nome do médico é obrigatório'),
  specialty: z.string()
    .nonempty('Especialidade é obrigatória'),
  appointmentDate: z.string()
    .nonempty('Data da consulta é obrigatória'),
});

type FormData = z.infer<typeof appointmentSchema>;

interface AppointmentFormProps {
  onSubmit: (data: CreateAppointmentDto) => Promise<void>;
  loading?: boolean;
  initialData?: Appointment;
  isEdit?: boolean;
}

export const AppointmentForm = ({ onSubmit, loading, initialData, isEdit = false }: AppointmentFormProps) => {
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialData ? {
      patientName: initialData.patientName,
      doctorName: initialData.doctorName,
      specialty: initialData.specialty,
      appointmentDate: format(new Date(initialData.appointmentDate), "yyyy-MM-dd'T'HH:mm"),
    } : undefined,
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setError(null);
      await onSubmit(data);
      if (!isEdit) {
        reset();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const specialties = [
    'Cardiologia',
    'Clínica Geral',
    'Pediatria',
    'Dermatologia',
    'Ortopedia',
    'Neurologia',
    'Ginecologia',
    'Oftalmologia',
    'Psiquiatria',
    'Urologia',
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Editar Consulta' : 'Nova Consulta'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Paciente *
          </label>
          <input
            {...register('patientName')}
            type="text"
            id="patientName"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o nome do paciente"
          />
          {errors.patientName && (
            <p className="mt-1 text-sm text-red-600">{errors.patientName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="doctorName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Médico *
          </label>
          <input
            {...register('doctorName')}
            type="text"
            id="doctorName"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite o nome do médico"
          />
          {errors.doctorName && (
            <p className="mt-1 text-sm text-red-600">{errors.doctorName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="specialty" className="block text-sm font-medium text-gray-700 mb-1">
            Especialidade *
          </label>
          <select
            {...register('specialty')}
            id="specialty"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione a especialidade</option>
            {specialties.map(esp => (
              <option key={esp} value={esp}>{esp}</option>
            ))}
          </select>
          {errors.specialty && (
            <p className="mt-1 text-sm text-red-600">{errors.specialty.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="appointmentDate" className="block text-sm font-medium text-gray-700 mb-1">
            Data e Hora da Consulta *
          </label>
          <input
            {...register('appointmentDate')}
            type="datetime-local"
            id="appointmentDate"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.appointmentDate && (
            <p className="mt-1 text-sm text-red-600">{errors.appointmentDate.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Salvando...' : (isEdit ? 'Atualizar' : 'Agendar')}
          </button>
          
          {!isEdit && (
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Limpar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};