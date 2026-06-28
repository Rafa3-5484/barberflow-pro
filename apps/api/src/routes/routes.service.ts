import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoutesService {
  private readonly logger = new Logger(RoutesService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const { page = 1, limit = 10, date, userId, sort = 'date', order = 'desc' } = query;

    const where: Prisma.RouteWhereInput = { companyId };

    if (date) where.date = new Date(date);
    if (userId) where.userId = userId;

    const [data, total] = await Promise.all([
      this.prisma.route.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          routeAppointments: {
            include: {
              appointment: {
                include: {
                  client: { select: { id: true, name: true, phone: true, address: true } },
                },
              },
            },
            orderBy: { order: 'asc' },
          },
        },
      }),
      this.prisma.route.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async findOne(companyId: string, id: string) {
    const route = await this.prisma.route.findFirst({
      where: { id, companyId },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        routeAppointments: {
          include: {
            appointment: {
              include: {
                client: { select: { id: true, name: true, phone: true, address: true } },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!route) throw new NotFoundException('Route not found');
    return route;
  }

  async create(companyId: string, userId: string, dto: any) {
    const existing = await this.prisma.route.findFirst({
      where: { companyId, userId: dto.userId || userId, date: new Date(dto.date) },
    });

    if (existing) {
      throw new BadRequestException('A route for this date and user already exists');
    }

    const route = await this.prisma.route.create({
      data: {
        companyId,
        userId: dto.userId || userId,
        date: new Date(dto.date),
        appointments: dto.appointments || [],
        totalDistance: dto.totalDistance || 0,
        totalDuration: dto.totalDuration || 0,
        fuelCost: dto.fuelCost || 0,
      },
    });

    if (dto.appointmentIds && dto.appointmentIds.length > 0) {
      for (let i = 0; i < dto.appointmentIds.length; i++) {
        await this.prisma.routeAppointment.create({
          data: {
            routeId: route.id,
            appointmentId: dto.appointmentIds[i],
            order: i + 1,
          },
        });
      }
    }

    return this.findOne(companyId, route.id);
  }

  async update(companyId: string, id: string, dto: any) {
    const route = await this.prisma.route.findFirst({
      where: { id, companyId },
    });

    if (!route) throw new NotFoundException('Route not found');

    return this.prisma.route.update({
      where: { id },
      data: dto,
    });
  }

  async delete(companyId: string, id: string) {
    const route = await this.prisma.route.findFirst({
      where: { id, companyId },
    });

    if (!route) throw new NotFoundException('Route not found');

    await this.prisma.routeAppointment.deleteMany({ where: { routeId: id } });
    await this.prisma.route.delete({ where: { id } });

    return { message: 'Route deleted successfully' };
  }

  async optimize(companyId: string, id: string) {
    const route = await this.prisma.route.findFirst({
      where: { id, companyId },
      include: {
        routeAppointments: {
          include: {
            appointment: {
              include: { client: true },
            },
          },
        },
      },
    });

    if (!route) throw new NotFoundException('Route not found');

    const appointments = route.routeAppointments.map((ra) => ra.appointment);

    const optimized = this.nearestNeighborOptimization(appointments);

    await this.prisma.routeAppointment.deleteMany({ where: { routeId: id } });

    for (let i = 0; i < optimized.length; i++) {
      await this.prisma.routeAppointment.create({
        data: {
          routeId: id,
          appointmentId: optimized[i].id,
          order: i + 1,
        },
      });
    }

    let totalDistance = 0;
    let totalDuration = 0;

    for (let i = 1; i < optimized.length; i++) {
      const dist = this.estimateDistance(optimized[i - 1], optimized[i]);
      const dur = this.estimateDuration(dist);
      totalDistance += dist;
      totalDuration += dur;

      await this.prisma.routeAppointment.updateMany({
        where: { routeId: id, appointmentId: optimized[i].id },
        data: { distanceFromPrevious: dist, durationFromPrevious: dur },
      });
    }

    const fuelCost = await this.calculateFuelCost(totalDistance);

    await this.prisma.route.update({
      where: { id },
      data: { optimized: true, totalDistance, totalDuration, fuelCost },
    });

    return this.findOne(companyId, id);
  }

  async getTodayRoutes(companyId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    return this.prisma.route.findMany({
      where: {
        companyId,
        date: { gte: today, lt: tomorrow },
      },
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        routeAppointments: {
          include: {
            appointment: {
              include: {
                client: { select: { id: true, name: true, phone: true, address: true } },
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  private nearestNeighborOptimization(appointments: any[]): any[] {
    if (appointments.length <= 1) return appointments;

    const unvisited = [...appointments];
    const optimized: any[] = [unvisited.shift()!];

    while (unvisited.length > 0) {
      const last = optimized[optimized.length - 1];
      let nearestIdx = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < unvisited.length; i++) {
        const dist = this.estimateDistance(last, unvisited[i]);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = i;
        }
      }

      optimized.push(unvisited.splice(nearestIdx, 1)[0]);
    }

    return optimized;
  }

  private estimateDistance(a: any, b: any): number {
    const addrA = a.client?.address as any;
    const addrB = b.client?.address as any;

    if (addrA?.lat && addrA?.lng && addrB?.lat && addrB?.lng) {
      return this.haversineDistance(addrA.lat, addrA.lng, addrB.lat, addrB.lng);
    }

    return Math.random() * 10 + 1;
  }

  private haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private estimateDuration(distanceKm: number): number {
    const avgSpeed = 30;
    return Math.round((distanceKm / avgSpeed) * 60);
  }

  async calculateFuelCost(totalDistanceKm: number): Promise<number> {
    const avgConsumption = 10;
    const fuelPricePerLiter = 6.5;
    return (totalDistanceKm / avgConsumption) * fuelPricePerLiter;
  }
}
