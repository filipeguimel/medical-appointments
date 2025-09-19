import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum AppointmentStatus {
  SCHEDULED = 'Agendado',
  CANCELLED = 'Cancelado',
  COMPLETED = 'Realizado',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  patientName: string;

  @Column({ length: 255 })
  doctorName: string;

  @Column({ length: 100 })
  specialty: string;

  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.SCHEDULED,
  })
  status: AppointmentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}