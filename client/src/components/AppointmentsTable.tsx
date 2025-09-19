import { useState } from 'react';
import { Appointment, AppointmentStatus } from '@/types/appointment';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Clock, User, UserCheck, Edit, Trash2, X } from 'lucide-react';

interface AppointmentsTableProps {
  appointments: Appointment[];
  loading?: boolean;
  onEdit: (appointment: Appointment) => void;
  onCancel: (id: number) => Promise<Appointment>;
  onDelete: (id: number) => Promise<void>;
}

export const AppointmentsTable = ({ 
  appointments, 
  loading, 
  onEdit, 
  onCancel, 
  onDelete 
}: AppointmentsTableProps) => {
  const [loadingAction, setLoadingAction] = useState<number | null>(null);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.SCHEDULED:
        return 'bg-green-100 text-green-800';
      case AppointmentStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      case AppointmentStatus.COMPLETED:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancel = async (id: number) => {
    try {
      setLoadingAction(id);
      await onCancel(id);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta consulta?')) {
      try {
        setLoadingAction(id);
        await onDelete(id);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const canCancel = (appointment: Appointment) => {
    if (appointment.status !== AppointmentStatus.SCHEDULED) return false;
    
    const now = new Date();
    const appointmentDate = new Date(appointment.appointmentDate);
    const hoursUntilAppointment = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return hoursUntilAppointment > 24;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Nenhuma consulta encontrada</p>
        <p className="text-gray-400 text-sm">Cadastre sua primeira consulta para começar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Consultas Médicas</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Paciente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Médico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Especialidade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((appointment) => (
              <tr key={appointment.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.patientName}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <UserCheck className="h-5 w-5 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">{appointment.doctorName}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{appointment.specialty}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-gray-400 mr-2" />
                    <div className="text-sm text-gray-900">
                      {format(new Date(appointment.appointmentDate), "dd/MM/yyyy 'às' HH:mm", { 
                        locale: ptBR 
                      })}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                    {appointment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {appointment.status === AppointmentStatus.SCHEDULED && (
                      <button
                        onClick={() => onEdit(appointment)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Editar consulta"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    
                    {canCancel(appointment) && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        disabled={loadingAction === appointment.id}
                        className="text-yellow-600 hover:text-yellow-900 p-1 rounded disabled:opacity-50"
                        title="Cancelar consulta"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(appointment.id)}
                      disabled={loadingAction === appointment.id}
                      className="text-red-600 hover:text-red-900 p-1 rounded disabled:opacity-50"
                      title="Excluir consulta"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};