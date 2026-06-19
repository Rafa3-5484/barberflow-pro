import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { UpdateStatusDto } from './dto/update-status.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    let clientId = dto.clientId;

    if (!clientId) {
      if (!dto.clientName || !dto.clientPhone) {
        throw new BadRequestException(
          'Provide clientId or clientName + clientPhone',
        );
      }

      const existing = await this.prisma.client.findUnique({
        where: { phone: dto.clientPhone },
      });

      if (existing) {
        clientId = existing.id;
      } else {
        const newClient = await this.prisma.client.create({
          data: {
            name: dto.clientName,
            phone: dto.clientPhone,
            email: dto.clientEmail,
          },
        });
        clientId = newClient.id;
      }
    }

    return this.prisma.appointment.create({
      data: {
        clientId,
        professionalId: dto.professionalId,
        serviceId: dto.serviceId,
        date: new Date(dto.date),
        notes: dto.notes,
        status: dto.status || 'SCHEDULED',
      },
      include: {
        client: true,
        professional: true,
        service: true,
      },
    });
  }

  async findAll() {
    return this.prisma.appointment.findMany({
      include: { client: true, professional: true, service: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id },
      include: { client: true, professional: true, service: true },
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: string, dto: UpdateAppointmentDto) {
    await this.findOne(id);
    return this.prisma.appointment.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
      },
      include: { client: true, professional: true, service: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.appointment.delete({ where: { id } });
  }

  async updateStatus(id: string, dto: UpdateStatusDto) {
    const appointment = await this.findOne(id);

    const validTransitions: Record<string, string[]> = {
      SCHEDULED: ['CONFIRMED', 'CANCELLED'],
      CONFIRMED: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
      IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
      NO_SHOW: [],
    };

    const allowed = validTransitions[appointment.status] || [];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${appointment.status} to ${dto.status}`,
      );
    }

    const updated = await this.prisma.appointment.update({
      where: { id },
      data: { status: dto.status },
      include: { client: true, professional: true, service: true },
    });

    if (dto.status === 'COMPLETED' && appointment.status !== 'COMPLETED') {
      await this.prisma.client.update({
        where: { id: appointment.clientId },
        data: {
          totalVisits: { increment: 1 },
          totalSpent: { increment: appointment.service.price },
          lastVisit: new Date(),
        },
      });
    } else if (dto.status !== 'COMPLETED' && appointment.status === 'COMPLETED') {
      await this.prisma.client.update({
        where: { id: appointment.clientId },
        data: {
          totalVisits: { decrement: 1 },
          totalSpent: { decrement: appointment.service.price },
        },
      });
    }

    return updated;
  }

  async findByDate(date: string) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.appointment.findMany({
      where: { date: { gte: startOfDay, lte: endOfDay } },
      include: { client: true, professional: true, service: true },
      orderBy: { date: 'asc' },
    });
  }

  async findByProfessional(professionalId: string) {
    return this.prisma.appointment.findMany({
      where: { professionalId },
      include: { client: true, professional: true, service: true },
      orderBy: { date: 'desc' },
    });
  }
}
