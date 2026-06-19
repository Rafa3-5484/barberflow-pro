import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId?: string) {
    const where = userId ? { userId } : {};
    return this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({
      where: { id },
      data: { read: true },
    });
  }

  async create(data: {
    title: string;
    message: string;
    type?: string;
    userId: string;
  }) {
    return this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type || 'INFO',
        userId: data.userId,
      },
    });
  }

  async sendTestWhatsApp(phone: string, message: string) {
    // Placeholder - Evolution API integration
    console.log(`[WhatsApp Test] To: ${phone}, Message: ${message}`);
    return { success: true, message: 'Test WhatsApp message sent (placeholder)' };
  }
}
