import { Injectable } from '@nestjs/common';

@Injectable()
export class WhatsAppService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.evolution-api.com';
    this.apiKey = process.env.WHATSAPP_API_KEY || '';
  }

  async sendMessage(to: string, message: string): Promise<boolean> {
    // Placeholder for Evolution API integration
    console.log(`[WhatsApp] Sending to ${to}: ${message}`);
    return true;
  }

  async sendAppointmentConfirmation(
    phone: string,
    clientName: string,
    professionalName: string,
    serviceName: string,
    date: Date,
  ): Promise<boolean> {
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `Olá ${clientName}! Seu agendamento foi confirmado:\n\n📅 Data: ${formattedDate}\n⏰ Horário: ${formattedTime}\n💇 Profissional: ${professionalName}\n✂️ Serviço: ${serviceName}\n\nObrigado por escolher a BarberFlow!`;

    return this.sendMessage(phone, message);
  }

  async sendReminder(
    phone: string,
    clientName: string,
    professionalName: string,
    date: Date,
  ): Promise<boolean> {
    const formattedDate = date.toLocaleDateString('pt-BR');
    const formattedTime = date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const message = `Lembrete: Olá ${clientName}! Você tem um agendamento amanhã às ${formattedTime} com ${professionalName}. Confirme sua presença!`;

    return this.sendMessage(phone, message);
  }
}
