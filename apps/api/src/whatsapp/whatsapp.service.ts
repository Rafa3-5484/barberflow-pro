import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(private prisma: PrismaService) {
    this.apiUrl = process.env.EVOLUTION_API_URL || '';
    this.apiKey = process.env.EVOLUTION_API_KEY || '';
  }

  async sendMessage(companyId: string, dto: { to: string; body: string; mediaUrl?: string }) {
    const message = await this.prisma.whatsAppMessage.create({
      data: {
        companyId,
        from: 'system',
        to: dto.to,
        body: dto.body,
        mediaUrl: dto.mediaUrl,
        messageType: 'text',
        status: 'PENDING',
      },
    });

    if (this.apiUrl && this.apiKey) {
      try {
        const response = await fetch(`${this.apiUrl}/message/sendText/${companyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
          },
          body: JSON.stringify({
            number: dto.to,
            text: dto.body,
            ...(dto.mediaUrl ? { mediaUrl: dto.mediaUrl } : {}),
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          await this.prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: { status: 'SENT', externalId: result.key?.id || result.messageId },
          });
        } else {
          await this.prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: { status: 'FAILED' },
          });
        }
      } catch (error: any) {
        this.logger.error(`Failed to send WhatsApp: ${error.message}`);
        await this.prisma.whatsAppMessage.update({
          where: { id: message.id },
          data: { status: 'FAILED' },
        });
      }
    }

    return message;
  }

  async sendTemplate(companyId: string, dto: { to: string; templateName: string; params: Record<string, string> }) {
    const message = await this.prisma.whatsAppMessage.create({
      data: {
        companyId,
        from: 'system',
        to: dto.to,
        body: `Template: ${dto.templateName}`,
        messageType: 'template',
        status: 'PENDING',
        metadata: dto.params,
      },
    });

    if (this.apiUrl && this.apiKey) {
      try {
        const response = await fetch(`${this.apiUrl}/message/sendTemplate/${companyId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': this.apiKey,
          },
          body: JSON.stringify({
            number: dto.to,
            templateName: dto.templateName,
            params: dto.params,
          }),
        });

        const result = await response.json();

        if (result.status === 'success') {
          await this.prisma.whatsAppMessage.update({
            where: { id: message.id },
            data: { status: 'SENT', externalId: result.key?.id || result.messageId },
          });
        }
      } catch (error: any) {
        this.logger.error(`Failed to send template: ${error.message}`);
        await this.prisma.whatsAppMessage.update({
          where: { id: message.id },
          data: { status: 'FAILED' },
        });
      }
    }

    return message;
  }

  async sendBudgetLink(companyId: string, phone: string, budgetId: string, budgetNumber: number) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const link = `${appUrl}/budgets/${budgetId}`;

    const body = `Olá! Seu orçamento nº ${budgetNumber} está disponível para visualização.\nAcesse: ${link}\n\nAguardamos seu feedback!`;

    return this.sendMessage(companyId, { to: phone, body });
  }

  async sendConfirmation(companyId: string, appointment: any) {
    const phone = appointment.client?.phone;
    if (!phone) return null;

    const dateStr = new Date(appointment.date).toLocaleDateString('pt-BR');
    const body = `Olá ${appointment.client.name}! Seu agendamento para ${appointment.title} no dia ${dateStr} às ${appointment.startTime} foi confirmado!`;

    return this.sendMessage(companyId, { to: phone, body });
  }

  async sendReminder(companyId: string, appointment: any) {
    const phone = appointment.client?.phone;
    if (!phone) return null;

    const dateStr = new Date(appointment.date).toLocaleDateString('pt-BR');
    const body = `Lembrete: Você tem um agendamento amanhã (${dateStr}) às ${appointment.startTime} para ${appointment.title}. Confirme ou reagende pelo link: ${process.env.NEXT_PUBLIC_APP_URL}/appointments/${appointment.id}`;

    return this.sendMessage(companyId, { to: phone, body });
  }

  async requestReview(companyId: string, phone: string, appointmentId: string) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const body = `Olá! Como foi o serviço realizado? Sua opinião é muito importante para nós!\nAvalie aqui: ${appUrl}/reviews/new/${appointmentId}`;

    return this.sendMessage(companyId, { to: phone, body });
  }

  async processWebhook(companyId: string, body: any) {
    this.logger.log(`Webhook received: ${JSON.stringify(body)}`);

    const messageData = body.data || body;
    const from = messageData.from || messageData.key?.remoteJid;
    const messageBody = messageData.message?.conversation ||
      messageData.message?.extendedTextMessage?.text ||
      messageData.text ||
      '';

    if (from && messageBody) {
      await this.prisma.whatsAppMessage.create({
        data: {
          companyId,
          from,
          to: 'system',
          body: messageBody,
          messageType: 'incoming',
          status: 'RECEIVED',
          metadata: body,
        },
      });
    }

    return { status: 'received' };
  }

  async handleCallback(data: any) {
    this.logger.log(`Callback received: ${JSON.stringify(data)}`);
    return { status: 'processed' };
  }

  async verifyWebhook(query: any) {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      return challenge;
    }

    return 'Verification failed';
  }
}
