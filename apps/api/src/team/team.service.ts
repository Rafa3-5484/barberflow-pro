import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, TeamMemberRole } from '@prisma/client';

@Injectable()
export class TeamService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const { page = 1, limit = 10, role, active, search } = query;

    const where: Prisma.TeamMemberWhereInput = { companyId };

    if (role) where.role = role as TeamMemberRole;
    if (active !== undefined) where.active = active === 'true';
    if (search) {
      where.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.teamMember.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true, name: true, email: true, phone: true, avatar: true, role: true,
            },
          },
        },
      }),
      this.prisma.teamMember.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async invite(companyId: string, dto: {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    role: TeamMemberRole;
    permissions?: string[];
    commission?: number;
  }) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      const existingMember = await this.prisma.teamMember.findFirst({
        where: { companyId, userId: existingUser.id },
      });

      if (existingMember) {
        throw new ConflictException('User is already a team member');
      }
    }

    const password = dto.password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = existingUser || (await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
        phone: dto.phone,
        role: 'TECHNICIAN',
        companyId,
      },
    }));

    const member = await this.prisma.teamMember.create({
      data: {
        companyId,
        userId: user.id,
        role: dto.role || 'TECHNICIAN',
        permissions: dto.permissions || [],
        commission: dto.commission,
      },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, avatar: true } },
      },
    });

    return { member, temporaryPassword: existingUser ? undefined : password };
  }

  async update(companyId: string, id: string, dto: any) {
    const member = await this.prisma.teamMember.findFirst({
      where: { id, companyId },
    });

    if (!member) throw new NotFoundException('Team member not found');

    return this.prisma.teamMember.update({
      where: { id },
      data: dto,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async deactivate(companyId: string, id: string) {
    const member = await this.prisma.teamMember.findFirst({
      where: { id, companyId },
    });

    if (!member) throw new NotFoundException('Team member not found');

    return this.prisma.teamMember.update({
      where: { id },
      data: { active: false },
    });
  }

  async getStats(companyId: string) {
    const members = await this.prisma.teamMember.findMany({
      where: { companyId, active: true },
      include: {
        user: {
          select: {
            id: true, name: true,
            appointments: {
              where: { status: 'COMPLETED' },
              select: { id: true, price: true },
            },
          },
        },
      },
    });

    const stats = members.map((m) => {
      const completedServices = m.user.appointments.length;
      const revenueGenerated = m.user.appointments.reduce((s, a) => s + (a.price || 0), 0);
      return {
        id: m.id,
        name: m.user.name,
        role: m.role,
        commission: m.commission,
        completedServices,
        revenueGenerated,
      };
    });

    const totalServices = stats.reduce((s, m) => s + m.completedServices, 0);
    const totalRevenue = stats.reduce((s, m) => s + m.revenueGenerated, 0);

    return { members: stats, totalServices, totalRevenue };
  }

  async updateCommission(companyId: string, id: string, commission: number) {
    const member = await this.prisma.teamMember.findFirst({
      where: { id, companyId },
    });

    if (!member) throw new NotFoundException('Team member not found');

    return this.prisma.teamMember.update({
      where: { id },
      data: { commission },
    });
  }

  async getTechnicianSchedule(companyId: string, userId: string, date?: string) {
    const where: any = {
      companyId,
      userId,
      status: { in: ['SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'] },
    };

    if (date) {
      const targetDate = new Date(date);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);
      where.date = { gte: targetDate, lt: endDate };
    }

    return this.prisma.appointment.findMany({
      where,
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
      include: {
        client: { select: { id: true, name: true, phone: true, address: true } },
      },
    });
  }
}
