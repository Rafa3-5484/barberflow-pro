import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private prisma: PrismaService) {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
      this.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  }

  async getUserNotifications(companyId: string, userId: string, query: any = {}) {
    const { page = 1, limit = 20, read } = query;

    const where: Prisma.NotificationWhereInput = {
      companyId,
      userId,
    };

    if (read !== undefined) where.read = read === 'true';

    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async getUnreadCount(companyId: string, userId: string) {
    const count = await this.prisma.notification.count({
      where: { companyId, userId, read: false },
    });

    return { unreadCount: count };
  }

  async createNotification(
    companyId: string,
    userId: string,
    type: string,
    title: string,
    message: string,
    data?: any,
  ) {
    return this.prisma.notification.create({
      data: { companyId, userId, type, title, message, data },
    });
  }

  async createBulkNotification(
    companyId: string,
    userIds: string[],
    type: string,
    title: string,
    message: string,
    data?: any,
  ) {
    const notifications = userIds.map((userId) => ({
      companyId,
      userId,
      type,
      title,
      message,
      data: data || undefined,
    }));

    await this.prisma.notification.createMany({ data: notifications });
    return { count: userIds.length };
  }

  async markAsRead(companyId: string, userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, companyId, userId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    return this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true, readAt: new Date() },
    });
  }

  async markAllAsRead(companyId: string, userId: string) {
    await this.prisma.notification.updateMany({
      where: { companyId, userId, read: false },
      data: { read: true, readAt: new Date() },
    });

    return { message: 'All notifications marked as read' };
  }

  async delete(companyId: string, userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findFirst({
      where: { id: notificationId, companyId, userId },
    });

    if (!notification) throw new NotFoundException('Notification not found');

    await this.prisma.notification.delete({ where: { id: notificationId } });
    return { message: 'Notification deleted' };
  }

  async sendEmail(to: string, subject: string, body: string, html?: string) {
    if (!this.transporter) {
      this.logger.warn('SMTP not configured. Email not sent.');
      return { message: 'SMTP not configured' };
    }

    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@serviceflow.ai',
        to,
        subject,
        text: body,
        html: html || body,
      });

      this.logger.log(`Email sent to ${to}: ${subject}`);
      return { message: 'Email sent successfully' };
    } catch (error: any) {
      this.logger.error(`Failed to send email: ${error.message}`);
      throw error;
    }
  }
}
