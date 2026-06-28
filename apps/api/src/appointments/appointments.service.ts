import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const {
      page = 1,
      limit = 10,
      sort = 'date',
      order = 'desc',
      status,
      dateFrom,
      dateTo,
      userId,
      clientId,
      type,
      priority,
      search,
    } = query;

    const where: Prisma.AppointmentWhereInput = { companyId };

    if (status) where.status = status as AppointmentStatus;
    if (userId) where.userId = userId;
    if (clientId) where.clientId = clientId;
    if (type) where.type = type as any;
    if (priority) where.priority = priority as any;

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.appointment.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          client: { select: { id: true, name: true, phone: true } },
          user: { select: { id: true, name: true, avatar: true } },
        },
      }),
      this.prisma.appointment.count({ where }),
    ]);

    return {
      data,
      meta: {
        total, page, limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true, avatar: true } },
        routeAppointments: { include: { route: true } },
        reviews: true,
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async create(companyId: string, userId: string, dto: any) {
    const hasConflict = await this.checkConflicts(companyId, {
      userId: dto.userId || userId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
    });

    if (hasConflict) {
      throw new BadRequestException('Time conflict with another appointment');
    }

    return this.prisma.appointment.create({
      data: { ...dto, companyId, userId },
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async update(companyId: string, id: string, dto: any) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (dto.startTime || dto.endTime || dto.date) {
      const hasConflict = await this.checkConflicts(companyId, {
        userId: dto.userId || appointment.userId,
        date: dto.date || appointment.date,
        startTime: dto.startTime || appointment.startTime,
        endTime: dto.endTime || appointment.endTime,
        excludeId: id,
      });

      if (hasConflict) {
        throw new BadRequestException('Time conflict with another appointment');
      }
    }

    return this.prisma.appointment.update({
      where: { id },
      data: dto,
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async delete(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    await this.prisma.appointment.delete({ where: { id } });
    return { message: 'Appointment deleted successfully' };
  }

  async confirm(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.status !== 'SCHEDULED') {
      throw new BadRequestException('Appointment cannot be confirmed from current status');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CONFIRMED', confirmedAt: new Date() },
    });
  }

  async complete(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (appointment.status !== 'CONFIRMED' && appointment.status !== 'IN_PROGRESS') {
      throw new BadRequestException('Appointment cannot be completed');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.appointment.update({
        where: { id },
        data: { status: 'COMPLETED', completedAt: new Date() },
      });

      if (appointment.price) {
        await tx.financialRecord.create({
          data: {
            companyId,
            clientId: appointment.clientId,
            appointmentId: id,
            type: 'REVENUE',
            category: 'Serviços',
            description: `Serviço: ${appointment.title}`,
            value: appointment.price,
            paymentMethod: 'OTHER',
            status: 'PENDING',
            dueDate: new Date(),
          },
        });
      }

      return updated;
    });

    return result;
  }

  async cancel(companyId: string, id: string) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    if (['COMPLETED', 'CANCELLED'].includes(appointment.status)) {
      throw new BadRequestException('Appointment cannot be cancelled');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
    });
  }

  async reschedule(companyId: string, id: string, dto: { date: string; startTime: string; endTime: string }) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    const hasConflict = await this.checkConflicts(companyId, {
      userId: appointment.userId,
      date: new Date(dto.date),
      startTime: dto.startTime,
      endTime: dto.endTime,
      excludeId: id,
    });

    if (hasConflict) {
      throw new BadRequestException('Time conflict with another appointment');
    }

    return this.prisma.appointment.update({
      where: { id },
      data: {
        date: new Date(dto.date),
        startTime: dto.startTime,
        endTime: dto.endTime,
        status: 'SCHEDULED',
        confirmedAt: null,
      },
    });
  }

  async getCalendar(companyId: string, query: any = {}) {
    const { dateFrom, dateTo, userId } = query;

    const where: Prisma.AppointmentWhereInput = { companyId };

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    if (userId) where.userId = userId;

    const appointments = await this.prisma.appointment.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        client: { select: { id: true, name: true, phone: true } },
        user: { select: { id: true, name: true, avatar: true } },
      },
    });

    const grouped: Record<string, any[]> = {};
    appointments.forEach((app) => {
      const key = app.date.toISOString().split('T')[0];
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(app);
    });

    return grouped;
  }

  async getUpcoming(companyId: string, limit = 10) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    return this.prisma.appointment.findMany({
      where: {
        companyId,
        date: { gte: today },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      take: limit,
      include: {
        client: { select: { id: true, name: true, phone: true } },
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  private async checkConflicts(
    companyId: string,
    params: { userId: string; date: Date | string; startTime: string; endTime: string; excludeId?: string },
  ): Promise<boolean> {
    const appointmentDate = new Date(params.date);

    const conflicts = await this.prisma.appointment.findFirst({
      where: {
        companyId,
        userId: params.userId,
        date: appointmentDate,
        status: { notIn: ['CANCELLED', 'COMPLETED'] },
        id: params.excludeId ? { not: params.excludeId } : undefined,
        AND: [
          { startTime: { lt: params.endTime } },
          { endTime: { gt: params.startTime } },
        ],
      },
    });

    return !!conflicts;
  }
}
