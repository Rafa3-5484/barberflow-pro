import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, CRMActivityType } from '@prisma/client';

@Injectable()
export class CRMModule {
  constructor(private prisma: PrismaService) {}

  async getTimeline(companyId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    const [activities, appointments, budgets, financial] = await Promise.all([
      this.prisma.cRMActivity.findMany({
        where: { clientId },
        include: { user: { select: { id: true, name: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      this.prisma.appointment.findMany({
        where: { clientId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.budget.findMany({
        where: { clientId },
        include: { user: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.financialRecord.findMany({
        where: { clientId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
    ]);

    return { activities, appointments, budgets, financial };
  }

  async addActivity(companyId: string, clientId: string, userId: string, dto: {
    type: CRMActivityType;
    description: string;
    metadata?: any;
  }) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    return this.prisma.cRMActivity.create({
      data: {
        companyId,
        clientId,
        userId: userId || undefined,
        type: dto.type,
        description: dto.description,
        metadata: dto.metadata,
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
      },
    });
  }

  async updateActivity(companyId: string, id: string, dto: { description?: string; type?: CRMActivityType; metadata?: any }) {
    const activity = await this.prisma.cRMActivity.findFirst({
      where: { id, companyId },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    return this.prisma.cRMActivity.update({
      where: { id },
      data: dto,
      include: { user: { select: { id: true, name: true } } },
    });
  }

  async deleteActivity(companyId: string, id: string) {
    const activity = await this.prisma.cRMActivity.findFirst({
      where: { id, companyId },
    });

    if (!activity) throw new NotFoundException('Activity not found');

    await this.prisma.cRMActivity.delete({ where: { id } });
    return { message: 'Activity deleted successfully' };
  }

  async getClientInsights(companyId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, companyId },
    });

    if (!client) throw new NotFoundException('Client not found');

    const appointments = await this.prisma.appointment.findMany({
      where: { clientId },
      orderBy: { createdAt: 'desc' },
    });

    const completed = appointments.filter((a) => a.status === 'COMPLETED');
    const cancelled = appointments.filter((a) => a.status === 'CANCELLED');

    const totalSpent = completed.reduce((s, a) => s + (a.price || 0), 0);
    const avgSpent = completed.length > 0 ? totalSpent / completed.length : 0;

    const now = new Date();
    const monthsSinceFirst =
      appointments.length > 0
        ? (now.getFullYear() - appointments[appointments.length - 1].createdAt.getFullYear()) * 12 +
          (now.getMonth() - appointments[appointments.length - 1].createdAt.getMonth())
        : 1;

    const frequencyPerMonth = monthsSinceFirst > 0 ? completed.length / monthsSinceFirst : 0;

    const reviews = await this.prisma.review.findMany({
      where: { clientId },
    });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;

    return {
      totalVisits: completed.length,
      totalCancelled: cancelled.length,
      cancellationRate: appointments.length > 0 ? (cancelled.length / appointments.length) * 100 : 0,
      totalSpent,
      averageSpent: avgSpent,
      frequencyPerMonth,
      averageRating: avgRating,
      totalReviews: reviews.length,
      lastVisit: completed[0]?.completedAt || null,
      preferredServices: this.getMostFrequentProperty(completed, 'title'),
    };
  }

  private getMostFrequentProperty(arr: any[], prop: string): any[] {
    const map = new Map<string, number>();
    arr.forEach((item) => {
      const value = item[prop];
      if (value) {
        map.set(value, (map.get(value) || 0) + 1);
      }
    });

    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }
}
