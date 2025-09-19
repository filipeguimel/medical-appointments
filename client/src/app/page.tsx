'use client';

import { useState } from 'react';
import { AppointmentForm } from '@/components/AppointmentsForm';
import { AppointmentsTable } from '@/components/AppointmentsTable';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment, CreateAppointmentDto, UpdateAppointmentDto } from '@/types/appointment';
import { Plus, Calendar } from 'lucide-react';

export default function Home() {
  const {
    appointments,
    loading,
    error,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
  } = useAppointments();

  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleCreateAppointment = async (data: CreateAppointmentDto) => {
    await createAppointment(data);
    setShowForm(false);
  };

  const handleUpdateAppointment = async (data: UpdateAppointmentDto) => {
    if (editingAppointment) {
      await updateAppointment(editingAppointment.id, data);
      setEditingAppointment(null);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(false);
  };

  const handleCancelEdit = () => {
    setEditingAppointment(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Sistema de Consultas Médicas
                </h1>
                <p className="text-gray-600 mt-1">
                  Gerencie agendamentos e consultas médicas
                </p>
              </div>
            </div>
            
            {!showForm && !editingAppointment && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Nova Consulta
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            <p className="font-medium">Erro:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Form Section */}
        {(showForm || editingAppointment) && (
          <div className="mb-8">
            <AppointmentForm
              onSubmit={editingAppointment ? handleUpdateAppointment : handleCreateAppointment}
              loading={loading}
              initialData={editingAppointment || undefined}
              isEdit={!!editingAppointment}
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Cancelar
              </button>
              {editingAppointment && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                >
                  Cancelar Edição
                </button>
              )}
            </div>
          </div>
        )}

        {/* Table Section */}
        <AppointmentsTable
          appointments={appointments}
          loading={loading && !showForm && !editingAppointment}
          onEdit={handleEdit}
          onCancel={cancelAppointment}
          onDelete={deleteAppointment}
        />
      </div>
    </div>
  );
}
