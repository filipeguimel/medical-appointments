import { IsString, IsNotEmpty, IsDateString, MinLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsString({ message: 'O nome do paciente deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do paciente é obrigatório' })
  @MinLength(3, { message: 'O nome do paciente deve ter pelo menos 3 caracteres' })
  patientName: string;

  @IsString({ message: 'O nome do médico deve ser um texto' })
  @IsNotEmpty({ message: 'O nome do médico é obrigatório' })
  @MinLength(3, { message: 'O nome do médico deve ter pelo menos 3 caracteres' })
  doctorName: string;

  @IsString({ message: 'A especialidade deve ser um texto' })
  @IsNotEmpty({ message: 'A especialidade é obrigatória' })
  specialty: string;

  @IsDateString({}, { message: 'A data da consulta deve estar em um formato de data válido' })
  @IsNotEmpty({ message: 'A data da consulta é obrigatória' })
  appointmentDate: string;
}