import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, FinancialType, FinancialStatus } from '@prisma/client';

@Injectable()
export class FinancialService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const {
      page = 1, limit = 10, sort = 'createdAt', order = 'desc',
      type, status, category, dateFrom, dateTo, clientId, search,
    } = query;

    const where: Prisma.FinancialRecordWhereInput = { companyId };

    if (type) where.type = type as FinancialType;
    if (status) where.status = status as FinancialStatus;
    if (category) where.category = { contains: category, mode: 'insensitive' };
    if (clientId) where.clientId = clientId;

    if (dateFrom || dateTo) {
      where.dueDate = {};
      if (dateFrom) where.dueDate.gte = new Date(dateFrom);
      if (dateTo) where.dueDate.lte = new Date(dateTo);
    }

    if (search) {
      where.description = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.financialRecord.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          client: { select: { id: true, name: true } },
        },
      }),
      this.prisma.financialRecord.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async findOne(companyId: string, id: string) {
    const record = await this.prisma.financialRecord.findFirst({
      where: { id, companyId },
      include: { client: true, appointment: true, budget: true },
    });

    if (!record) throw new NotFoundException('Financial record not found');
    return record;
  }

  async create(companyId: string, dto: any) {
    return this.prisma.financialRecord.create({
      data: { ...dto, companyId },
      include: { client: { select: { id: true, name: true } } },
    });
  }

  async update(companyId: string, id: string, dto: any) {
    const record = await this.prisma.financialRecord.findFirst({
      where: { id, companyId },
    });

    if (!record) throw new NotFoundException('Financial record not found');

    return this.prisma.financialRecord.update({
      where: { id },
      data: dto,
    });
  }

  async delete(companyId: string, id: string) {
    const record = await this.prisma.financialRecord.findFirst({
      where: { id, companyId },
    });

    if (!record) throw new NotFoundException('Financial record not found');

    await this.prisma.financialRecord.delete({ where: { id } });
    return { message: 'Record deleted successfully' };
  }

  async getDashboard(companyId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);
    endOfMonth.setHours(23, 59, 59, 999);

    const records = await this.prisma.financialRecord.findMany({
      where: {
        companyId,
        dueDate: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    const revenue = records
      .filter((r) => r.type === 'REVENUE' && r.status === 'PAID')
      .reduce((sum, r) => sum + r.value, 0);

    const expenses = records
      .filter((r) => r.type === 'EXPENSE' && r.status === 'PAID')
      .reduce((sum, r) => sum + r.value, 0);

    const pending = records
      .filter((r) => r.status === 'PENDING')
      .reduce((sum, r) => sum + r.value, 0);

    const overdue = records
      .filter((r) => r.status === 'OVERDUE')
      .reduce((sum, r) => sum + r.value, 0);

    const servicesCount = await this.prisma.appointment.count({
      where: {
        companyId,
        status: 'COMPLETED',
        completedAt: { gte: startOfMonth, lte: endOfMonth },
      },
    });

    return {
      revenue,
      expenses,
      profit: revenue - expenses,
      pending,
      overdue,
      servicesCount,
    };
  }

  async getIndicators(companyId: string) {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    const records = await this.prisma.financialRecord.findMany({
      where: {
        companyId,
        type: 'REVENUE',
        status: 'PAID',
        paidAt: { gte: startOfYear },
      },
    });

    const services = await this.prisma.appointment.findMany({
      where: {
        companyId,
        status: 'COMPLETED',
        completedAt: { gte: startOfYear },
      },
      select: { price: true, completedAt: true, title: true },
    });

    const totalRevenue = records.reduce((s, r) => s + r.value, 0);
    const totalServices = services.length;
    const averageTicket = totalServices > 0 ? totalRevenue / totalServices : 0;

    const monthlyData: Record<string, { revenue: number; count: number }> = {};
    records.forEach((r) => {
      if (r.paidAt) {
        const key = `${r.paidAt.getFullYear()}-${String(r.paidAt.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[key]) monthlyData[key] = { revenue: 0, count: 0 };
        monthlyData[key].revenue += r.value;
        monthlyData[key].count += 1;
      }
    });

    const bestMonths = Object.entries(monthlyData)
      .sort(([, a], [, b]) => b.revenue - a.revenue)
      .slice(0, 3)
      .map(([month, data]) => ({ month, ...data }));

    const serviceProfitability: Record<string, { total: number; count: number }> = {};
    services.forEach((s) => {
      if (s.price) {
        if (!serviceProfitability[s.title]) serviceProfitability[s.title] = { total: 0, count: 0 };
        serviceProfitability[s.title].total += s.price;
        serviceProfitability[s.title].count += 1;
      }
    });

    const mostProfitableServices = Object.entries(serviceProfitability)
      .sort(([, a], [, b]) => b.total - a.total)
      .slice(0, 5)
      .map(([name, data]) => ({ name, ...data }));

    return { averageTicket, totalRevenue, totalServices, bestMonths, mostProfitableServices };
  }

  async getReceivables(companyId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    const allReceivables = await this.prisma.financialRecord.findMany({
      where: {
        companyId,
        type: 'REVENUE',
        status: { in: ['PENDING', 'OVERDUE'] },
      },
    });

    const todayTotal = allReceivables
      .filter((r) => r.dueDate >= today && r.dueDate <= today)
      .reduce((s, r) => s + r.value, 0);

    const weekTotal = allReceivables
      .filter((r) => r.dueDate >= today && r.dueDate <= endOfWeek)
      .reduce((s, r) => s + r.value, 0);

    const monthTotal = allReceivables
      .filter((r) => r.dueDate >= today && r.dueDate <= endOfMonth)
      .reduce((s, r) => s + r.value, 0);

    const yearTotal = allReceivables
      .filter((r) => r.dueDate >= today && r.dueDate <= endOfYear)
      .reduce((s, r) => s + r.value, 0);

    return { today: todayTotal, week: weekTotal, month: monthTotal, year: yearTotal, total: yearTotal };
  }

  async getReport(companyId: string, query: { dateFrom?: string; dateTo?: string; type?: string }) {
    const where: Prisma.FinancialRecordWhereInput = { companyId };

    if (query.dateFrom || query.dateTo) {
      where.dueDate = {};
      if (query.dateFrom) where.dueDate.gte = new Date(query.dateFrom);
      if (query.dateTo) where.dueDate.lte = new Date(query.dateTo);
    }

    if (query.type) where.type = query.type as FinancialType;

    const records = await this.prisma.financialRecord.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: { client: { select: { id: true, name: true } } },
    });

    const totalRevenue = records.filter((r) => r.type === 'REVENUE').reduce((s, r) => s + r.value, 0);
    const totalExpenses = records.filter((r) => r.type === 'EXPENSE').reduce((s, r) => s + r.value, 0);
    const paidRevenue = records.filter((r) => r.type === 'REVENUE' && r.status === 'PAID').reduce((s, r) => s + r.value, 0);
    const pending = records.filter((r) => r.status === 'PENDING').reduce((s, r) => s + r.value, 0);
    const overdue = records.filter((r) => r.status === 'OVERDUE').reduce((s, r) => s + r.value, 0);

    const byCategory: Record<string, { revenue: number; expense: number }> = {};
    records.forEach((r) => {
      const cat = r.category || 'Outros';
      if (!byCategory[cat]) byCategory[cat] = { revenue: 0, expense: 0 };
      if (r.type === 'REVENUE') byCategory[cat].revenue += r.value;
      else byCategory[cat].expense += r.value;
    });

    return {
      records,
      summary: { totalRevenue, totalExpenses, profit: totalRevenue - totalExpenses, paidRevenue, pending, overdue },
      byCategory,
    };
  }
}
