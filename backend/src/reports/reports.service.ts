import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private getDateRange(dateStr: string, type: 'day' | 'week' | 'month') {
    const date = new Date(dateStr);
    let start: Date, end: Date;

    if (type === 'day') {
      start = new Date(date);
      start.setHours(0, 0, 0, 0);
      end = new Date(date);
      end.setHours(23, 59, 59, 999);
    } else if (type === 'week') {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      start = new Date(date);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
    } else {
      start = new Date(date.getFullYear(), date.getMonth(), 1);
      end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    }

    return { start, end };
  }

  async daily(date: string) {
    const { start, end } = this.getDateRange(date, 'day');
    return this.generateReport(start, end);
  }

  async weekly(date: string) {
    const { start, end } = this.getDateRange(date, 'week');
    return this.generateReport(start, end);
  }

  async monthly(date: string) {
    const { start, end } = this.getDateRange(date, 'month');
    return this.generateReport(start, end);
  }

  async annual(year: number) {
    const start = new Date(year, 0, 1);
    const end = new Date(year, 11, 31, 23, 59, 59, 999);
    return this.generateReport(start, end);
  }

  private async generateReport(start: Date, end: Date) {
    const appointments = await this.prisma.appointment.findMany({
      where: { date: { gte: start, lte: end } },
      include: { client: true, professional: true, service: true },
      orderBy: { date: 'asc' },
    });

    const completed = appointments.filter((a) => a.status === 'COMPLETED');
    const cancelled = appointments.filter((a) => a.status === 'CANCELLED');
    const noShow = appointments.filter((a) => a.status === 'NO_SHOW');

    const totalRevenue = completed.reduce(
      (sum, a) => sum + a.service.price,
      0,
    );
    const totalAppointments = appointments.length;
    const completedCount = completed.length;
    const cancelledCount = cancelled.length;
    const noShowCount = noShow.length;

    const ticketMedio = completedCount > 0 ? totalRevenue / completedCount : 0;

    const clientIds = [
      ...new Set(completed.map((a) => a.clientId)),
    ];

    const allTimeClients = await this.prisma.client.findMany({
      where: { id: { in: clientIds } },
      select: { id: true, createdAt: true },
    });

    const novos = allTimeClients.filter(
      (c) => c.createdAt >= start && c.createdAt <= end,
    ).length;
    const recorrentes = clientIds.length - novos;

    const servicesMap = new Map<string, { name: string; count: number; revenue: number }>();
    for (const a of completed) {
      const existing = servicesMap.get(a.service.id) || {
        name: a.service.name,
        count: 0,
        revenue: 0,
      };
      existing.count++;
      existing.revenue += a.service.price;
      servicesMap.set(a.service.id, existing);
    }
    const servicosMaisVendidos = [...servicesMap.entries()]
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.count - a.count);

    const hoursMap = new Map<string, number>();
    for (const a of appointments) {
      const hour = new Date(a.date).getHours().toString().padStart(2, '0');
      hoursMap.set(hour, (hoursMap.get(hour) || 0) + 1);
    }
    const horariosMaisProcurados = [...hoursMap.entries()]
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }))
      .sort((a, b) => b.count - a.count);

    const profCommission = new Map<
      string,
      { name: string; revenue: number; commission: number }
    >();
    for (const a of completed) {
      const pName = a.professional.name;
      const existing = profCommission.get(a.professional.id) || {
        name: pName,
        revenue: 0,
        commission: 0,
      };
      existing.revenue += a.service.price;
      profCommission.set(a.professional.id, existing);
    }

    const professionals = await this.prisma.professional.findMany();
    const profMap = new Map(professionals.map((p) => [p.id, p]));
    for (const [id, data] of profCommission) {
      const prof = profMap.get(id);
      data.commission = data.revenue * ((prof?.commission || 0) / 100);
    }

    const comissaoPorProfissional = [...profCommission.entries()].map(
      ([id, data]) => ({ id, ...data }),
    );

    const totalHours = end.getTime() - start.getTime();
    const totalDays = Math.ceil(totalHours / (1000 * 60 * 60 * 24));
    const availableSlots = totalDays * 8 * professionals.length;
    const ocupacao =
      availableSlots > 0
        ? Math.round((completedCount / availableSlots) * 100)
        : 0;

    return {
      periodo: { inicio: start, fim: end },
      resumo: {
        totalAgendamentos: totalAppointments,
        totalConfirmados: completedCount,
        totalCancelados: cancelledCount,
        totalNoShow: noShowCount,
        faturamentoTotal: totalRevenue,
        ticketMedio: Math.round(ticketMedio * 100) / 100,
        taxaOcupacao: ocupacao,
      },
      clientes: {
        novos,
        recorrentes,
        total: clientIds.length,
      },
      servicosMaisVendidos,
      horariosMaisProcurados,
      comissaoPorProfissional,
    };
  }

  async dashboard() {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(now);
    todayEnd.setHours(23, 59, 59, 999);

    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const todayReport = await this.generateReport(todayStart, todayEnd);
    const monthReport = await this.generateReport(monthStart, monthEnd);

    const totalClients = await this.prisma.client.count();
    const activeProfessionals = await this.prisma.professional.count({
      where: { active: true },
    });
    const totalServices = await this.prisma.service.count();
    const upcomingAppointments = await this.prisma.appointment.count({
      where: {
        date: { gte: now },
        status: { in: ['SCHEDULED', 'CONFIRMED'] },
      },
    });

    return {
      today: todayReport.resumo,
      month: monthReport.resumo,
      geral: {
        totalClientes: totalClients,
        profissionaisAtivos: activeProfessionals,
        totalServicos: totalServices,
        proximosAgendamentos: upcomingAppointments,
      },
      servicosMaisVendidosMes: monthReport.servicosMaisVendidos,
      horariosMaisProcuradosMes: monthReport.horariosMaisProcurados,
      comissaoPorProfissionalMes: monthReport.comissaoPorProfissional,
    };
  }
}
