import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      role,
      active,
    } = query;

    const where: Prisma.UserWhereInput = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) where.role = role as UserRole;
    if (active !== undefined) where.active = active === 'true';

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: {
          id: true, email: true, name: true, phone: true, avatar: true,
          role: true, active: true, emailVerified: true,
          lastLoginAt: true, createdAt: true, updatedAt: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrevious: page > 1,
      },
    };
  }

  async findOne(companyId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, companyId },
      select: {
        id: true, email: true, name: true, phone: true, avatar: true,
        role: true, active: true, emailVerified: true,
        lastLoginAt: true, createdAt: true, updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(companyId: string, id: string, dto: any) {
    const user = await this.prisma.user.findFirst({
      where: { id, companyId },
    });

    if (!user) throw new NotFoundException('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (existing) throw new ConflictException('Email already in use');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: {
        id: true, email: true, name: true, phone: true, avatar: true,
        role: true, active: true, emailVerified: true,
        lastLoginAt: true, createdAt: true, updatedAt: true,
      },
    });

    return updated;
  }

  async deactivate(companyId: string, id: string) {
    const user = await this.prisma.user.findFirst({
      where: { id, companyId },
    });

    if (!user) throw new NotFoundException('User not found');

    if (user.role === 'OWNER') {
      throw new BadRequestException('Cannot deactivate the company owner');
    }

    return this.prisma.user.update({
      where: { id },
      data: { active: false },
      select: { id: true, active: true },
    });
  }

  async updateProfile(userId: string, dto: any) {
    if (dto.email) {
      const existing = await this.prisma.user.findFirst({
        where: { email: dto.email, id: { not: userId } },
      });
      if (existing) throw new ConflictException('Email already in use');
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true, email: true, name: true, phone: true, avatar: true,
        role: true, createdAt: true, updatedAt: true,
      },
    });

    return updated;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) throw new BadRequestException('Current password is incorrect');

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password updated successfully' };
  }

  async listTeamMembers(companyId: string) {
    return this.prisma.user.findMany({
      where: {
        companyId,
        active: true,
        role: { in: ['TECHNICIAN', 'ATTENDANT', 'ADMIN'] },
      },
      select: {
        id: true, name: true, email: true, phone: true, avatar: true, role: true,
      },
      orderBy: { name: 'asc' },
    });
  }
}
