import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      search,
      tags,
      source,
    } = query;

    const where: Prisma.ClientWhereInput = { companyId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { document: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (tags) {
      const tagList = tags.split(',');
      where.tags = { hasSome: tagList };
    }

    if (source) where.source = source;

    const [data, total] = await Promise.all([
      this.prisma.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          _count: { select: { appointments: true, budgets: true } },
        },
      }),
      this.prisma.client.count({ where }),
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
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
      include: {
        _count: { select: { appointments: true, budgets: true, financial: true, reviews: true } },
      },
    });

    if (!client) throw new NotFoundException('Client not found');
    return client;
  }

  async create(companyId: string, dto: any) {
    return this.prisma.client.create({
      data: { ...dto, companyId },
    });
  }

  async update(companyId: string, id: string, dto: any) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  async delete(companyId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    await this.prisma.client.delete({ where: { id } });
    return { message: 'Client deleted successfully' };
  }

  async getHistory(companyId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    const [appointments, budgets, financial, activities] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { clientId: id },
        orderBy: { date: 'desc' },
        take: 20,
      }),
      this.prisma.budget.findMany({
        where: { clientId: id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.financialRecord.findMany({
        where: { clientId: id },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.cRMActivity.findMany({
        where: { clientId: id },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    ]);

    return { client, appointments, budgets, financial, activities };
  }

  async getTimeline(companyId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: { id, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    const [appointments, budgets, financial, activities] = await Promise.all([
      this.prisma.appointment.findMany({
        where: { clientId: id },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.budget.findMany({
        where: { clientId: id },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.financialRecord.findMany({
        where: { clientId: id },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.cRMActivity.findMany({
        where: { clientId: id },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'asc' },
      }),
    ]);

    const timeline = [
      ...appointments.map((a) => ({ ...a, type: 'appointment', date: a.createdAt })),
      ...budgets.map((b) => ({ ...b, type: 'budget', date: b.createdAt })),
      ...financial.map((f) => ({ ...f, type: 'financial', date: f.createdAt })),
      ...activities.map((a) => ({ ...a, type: 'activity', date: a.createdAt })),
    ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return timeline;
  }

  async getStats(companyId: string) {
    const clients = await this.prisma.client.findMany({ where: { companyId } });
    const totalClients = clients.length;
    const activeClients = clients.filter((c) => c.totalVisits > 0).length;
    const totalSpent = clients.reduce((sum, c) => sum + c.totalSpent, 0);
    const totalVisits = clients.reduce((sum, c) => sum + c.totalVisits, 0);
    const averageTicket = totalVisits > 0 ? totalSpent / totalVisits : 0;

    const tagMap = new Map<string, number>();
    clients.forEach((c) => {
      c.tags?.forEach((t) => tagMap.set(t, (tagMap.get(t) || 0) + 1));
    });

    const tagStats = Array.from(tagMap.entries()).map(([tag, count]) => ({
      tag,
      count,
    }));

    return {
      totalClients,
      activeClients,
      totalSpent,
      totalVisits,
      averageTicket,
      tagStats,
    };
  }
}
