import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from './appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    ) {}

  async create(createAppointmentDto: CreateAppointmentDto): Promise<Appointment> {
    const {doctorName, appointmentDate} = createAppointmentDto;
    const appointmentDateObj = new Date(appointmentDate);

    const now = new Date();
    if (appointmentDateObj <= now) {
      throw new BadRequestException('Não é permitido agendar consultas no passado.');
        }

    const existingAppointment = await this.appointmentsRepository.findOne({
      where: {
        doctorName,
        appointmentDate: appointmentDateObj,
        status: AppointmentStatus.SCHEDULED,
      },
    });
    
    if (existingAppointment) {
      throw new BadRequestException('Já existe uma consulta para este médico neste horário.');
    }

    const appointment = this.appointmentsRepository.create({
      ...createAppointmentDto,
      appointmentDate: appointmentDateObj,
      status: AppointmentStatus.SCHEDULED,
    })

    return this.appointmentsRepository.save(appointment);
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentsRepository.find({
      order: { appointmentDate: 'ASC' },
    });
  }
  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentsRepository.findOne({ where: { id } });
    
    if (!appointment) {
      throw new NotFoundException(`Consulta com ID ${id} não encontrada.`);
    }

    return appointment;
  }

  async update(id: number, updateAppointmentDto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (updateAppointmentDto.appointmentDate) {
      const newDate = new Date(updateAppointmentDto.appointmentDate);
      const now = new Date();
      
      if (newDate <= now) {
        throw new BadRequestException('Não é permitido agendar consultas no passado.');
      }
  
      const conflictAppointment = await this.appointmentsRepository.findOne({
        where: {
          doctorName: updateAppointmentDto.doctorName || appointment.doctorName,
          appointmentDate: newDate,
          status: AppointmentStatus.SCHEDULED
        },
      });

      if (conflictAppointment && conflictAppointment.id !== id) {
        throw new BadRequestException('Já existe uma consulta para este médico neste horário.');
      }
    }

    Object.assign(appointment, updateAppointmentDto);

    if (updateAppointmentDto.appointmentDate) {
      appointment.appointmentDate = new Date(updateAppointmentDto.appointmentDate);
    }

    return this.appointmentsRepository.save(appointment);
  }

  async cancel(id: number): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException('Esta consulta já foi cancelada.');
    }

    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new BadRequestException('Não é possível cancelar uma consulta já realizada.');
    }

    const now = new Date();
    const limit = new Date(appointment.appointmentDate);
    limit.setHours(limit.getHours() - 24);

    if (now > limit) {
      throw new BadRequestException('Uma consulta só pode ser cancelada até 24 horas antes do horário marcado.');
    }

    appointment.status = AppointmentStatus.CANCELLED;
    return this.appointmentsRepository.save(appointment);
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentsRepository.remove(appointment);
  }
}