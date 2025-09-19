export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  CANCELLED = 'Cancelado',
  COMPLETED = 'Realizado',
}

export interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
  status: AppointmentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAppointmentDto {
  patientName: string;
  doctorName: string;
  specialty: string;
  appointmentDate: string;
}

export interface UpdateAppointmentDto {
  patientName?: string;
  doctorName?: string;
  specialty?: string;
  appointmentDate?: string;
  status?: AppointmentStatus;
}