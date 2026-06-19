import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProfessionalDto } from './dto/create-professional.dto.js';
import { UpdateProfessionalDto } from './dto/update-professional.dto.js';

@Injectable()
export class ProfessionalsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProfessionalDto) {
    return this.prisma.professional.create({ data: dto });
  }

  async findAll() {
    return this.prisma.professional.findMany({
      include: { _count: { select: { appointments: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const professional = await this.prisma.professional.findUnique({
      where: { id },
      include: { appointments: { include: { client: true, service: true } } },
    });
    if (!professional) throw new NotFoundException('Professional not found');
    return professional;
  }

  async update(id: string, dto: UpdateProfessionalDto) {
    await this.findOne(id);
    return this.prisma.professional.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.professional.delete({ where: { id } });
  }

  async findAvailable(date: string) {
    const selectedDate = new Date(date);
    const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

    const professionals = await this.prisma.professional.findMany({
      where: { active: true },
      include: {
        appointments: {
          where: {
            date: { gte: startOfDay, lte: endOfDay },
            status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
          },
          include: { service: true },
        },
      },
    });

    return professionals;
  }

  async calculateCommission(id: string, startDate: Date, endDate: Date) {
    const professional = await this.findOne(id);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        professionalId: id,
        date: { gte: startDate, lte: endDate },
        status: 'COMPLETED',
      },
      include: { service: true },
    });

    const totalRevenue = appointments.reduce(
      (sum, apt) => sum + apt.service.price,
      0,
    );

    return {
      professionalId: id,
      professionalName: professional.name,
      commissionRate: professional.commission,
      totalRevenue,
      commissionValue: totalRevenue * (professional.commission / 100),
      totalAppointments: appointments.length,
    };
  }
}
