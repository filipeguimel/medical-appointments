import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum } from 'class-validator';
import { CreateAppointmentDto } from './create-appointment.dto';
import { AppointmentStatus } from '../appointment.entity';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
    @IsOptional()
    @IsEnum(AppointmentStatus, { message: 'Status deve ser: Agendado, Cancelado ou Realizado' })
    status?: AppointmentStatus; 
} 