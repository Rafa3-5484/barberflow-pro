import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, BudgetStatus } from '@prisma/client';

@Injectable()
export class BudgetsService {
  private readonly logger = new Logger(BudgetsService.name);
  private readonly PIX_KEY = '00020126580014br.gov.bcb.pix0136';

  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      order = 'desc',
      status,
      clientId,
      dateFrom,
      dateTo,
      search,
    } = query;

    const where: Prisma.BudgetWhereInput = { companyId };

    if (status) where.status = status as BudgetStatus;
    if (clientId) where.clientId = clientId;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) where.createdAt.gte = new Date(dateFrom);
      if (dateTo) where.createdAt.lte = new Date(dateTo);
    }

    if (search) {
      where.OR = [
        { number: parseInt(search) || undefined },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
      ].filter(Boolean) as Prisma.BudgetWhereInput[];
    }

    const [data, total] = await Promise.all([
      this.prisma.budget.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          client: { select: { id: true, name: true, phone: true } },
          user: { select: { id: true, name: true } },
        },
      }),
      this.prisma.budget.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async findOne(companyId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        user: { select: { id: true, name: true, email: true } },
        appointment: true,
        financial: true,
      },
    });

    if (!budget) throw new NotFoundException('Budget not found');
    return budget;
  }

  async create(companyId: string, userId: string, dto: any) {
    const lastBudget = await this.prisma.budget.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    const nextNumber = (lastBudget?.number || 0) + 1;

    return this.prisma.budget.create({
      data: {
        ...dto,
        companyId,
        userId,
        number: nextNumber,
      },
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async update(companyId: string, id: string, dto: any) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, companyId },
    });

    if (!budget) throw new NotFoundException('Budget not found');

    if (budget.status !== 'DRAFT') {
      throw new BadRequestException('Only draft budgets can be edited');
    }

    return this.prisma.budget.update({
      where: { id },
      data: dto,
      include: {
        client: { select: { id: true, name: true } },
        user: { select: { id: true, name: true } },
      },
    });
  }

  async delete(companyId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, companyId },
    });

    if (!budget) throw new NotFoundException('Budget not found');

    await this.prisma.budget.delete({ where: { id } });
    return { message: 'Budget deleted successfully' };
  }

  async send(companyId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, companyId },
    });

    if (!budget) throw new NotFoundException('Budget not found');

    if (budget.status !== 'DRAFT') {
      throw new BadRequestException('Budget has already been sent');
    }

    return this.prisma.budget.update({
      where: { id },
      data: { status: 'SENT', sentAt: new Date() },
    });
  }

  async accept(companyId: string, id: string, dto: { signature?: string; ip?: string; lat?: number; lng?: number }) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, companyId },
    });

    if (!budget) throw new NotFoundException('Budget not found');

    if (budget.status === 'ACCEPTED') {
      throw new BadRequestException('Budget has already been accepted');
    }

    if (budget.status === 'REJECTED' || budget.status === 'EXPIRED') {
      throw new BadRequestException('Budget cannot be accepted');
    }

    const pixPayload = this.generatePixPayload(budget);

    return this.prisma.budget.update({
      where: { id },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
        acceptedIp: dto.ip,
        acceptedLat: dto.lat,
        acceptedLng: dto.lng,
        signatureUrl: dto.signature,
        pixCode: pixPayload,
      },
    });
  }

  async reject(companyId: string, id: string) {
    const budget = await this.prisma.budget.findFirst({
      where: { id, companyId },
    });

    if (!budget) throw new NotFoundException('Budget not found');

    if (budget.status === 'ACCEPTED') {
      throw new BadRequestException('Budget has already been accepted');
    }

    return this.prisma.budget.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }

  async duplicate(companyId: string, userId: string, id: string) {
    const original = await this.prisma.budget.findFirst({
      where: { id, companyId },
    });

    if (!original) throw new NotFoundException('Budget not found');

    const lastBudget = await this.prisma.budget.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    const nextNumber = (lastBudget?.number || 0) + 1;

    const { id: _id, createdAt, updatedAt, sentAt, acceptedAt, acceptedIp, acceptedLat, acceptedLng, signatureUrl, pixCode, pixQrCode, items: _items, ...data } = original;

    return this.prisma.budget.create({
      data: {
        ...data,
        number: nextNumber,
        status: 'DRAFT',
        userId,
        items: _items ?? [],
      },
      include: {
        client: { select: { id: true, name: true } },
      },
    });
  }

  async getLastNumber(companyId: string) {
    const lastBudget = await this.prisma.budget.findFirst({
      where: { companyId },
      orderBy: { number: 'desc' },
      select: { number: true },
    });

    return { lastNumber: lastBudget?.number || 0 };
  }

  async generatePdf(companyId: string, id: string): Promise<string> {
    const budget = await this.findOne(companyId, id);

    const items = (budget.items as any[]) || [];
    const itemsHtml = items
      .map(
        (item: any) => `
      <tr>
        <td>${item.description || item.name || ''}</td>
        <td>${item.quantity || 1}</td>
        <td>R$ ${(item.unitPrice || item.price || 0).toFixed(2)}</td>
        <td>R$ ${((item.quantity || 1) * (item.unitPrice || item.price || 0)).toFixed(2)}</td>
      </tr>`,
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #2563eb; margin: 0; }
        .info { margin-bottom: 20px; }
        .info table { width: 100%; }
        .info td { padding: 4px 8px; }
        table.items { width: 100%; border-collapse: collapse; margin: 20px 0; }
        table.items th { background: #2563eb; color: white; padding: 10px 8px; text-align: left; }
        table.items td { border-bottom: 1px solid #ddd; padding: 10px 8px; }
        .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
        .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
        .conditions { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
      </style></head>
      <body>
        <div class="header"><h1>ORÇAMENTO</h1><p>Nº ${budget.number}</p></div>
        <div class="info">
          <table><tr><td><strong>Cliente:</strong> ${budget.client.name}</td>
          <td><strong>Data:</strong> ${new Date(budget.createdAt).toLocaleDateString('pt-BR')}</td></tr>
          <tr><td><strong>Validade:</strong> ${new Date(budget.validity).toLocaleDateString('pt-BR')}</td>
          <td><strong>Status:</strong> ${budget.status}</td></tr></table>
        </div>
        <table class="items">
          <tr><th>Descrição</th><th>Qtd</th><th>Valor Unit.</th><th>Total</th></tr>
          ${itemsHtml}
        </table>
        <div class="total">
          Subtotal: R$ ${budget.subtotal.toFixed(2)}<br>
          ${budget.discount ? `Desconto: R$ ${budget.discount.toFixed(2)}<br>` : ''}
          ${budget.shipping ? `Frete: R$ ${budget.shipping.toFixed(2)}<br>` : ''}
          Total: R$ ${budget.total.toFixed(2)}
        </div>
        ${budget.conditions ? `<div class="conditions"><strong>Condições:</strong><p>${budget.conditions}</p></div>` : ''}
        ${budget.warranty ? `<div class="conditions"><strong>Garantia:</strong><p>${budget.warranty}</p></div>` : ''}
        <div class="footer">Documento gerado em ${new Date().toLocaleString('pt-BR')}</div>
      </body></html>`;

    return html;
  }

  async expireOldBudgets() {
    const now = new Date();

    const expired = await this.prisma.budget.updateMany({
      where: {
        status: { in: ['SENT', 'VIEWED'] },
        validity: { lt: now },
      },
      data: { status: 'EXPIRED' },
    });

    this.logger.log(`Expired ${expired.count} old budgets`);
    return { expired: expired.count };
  }

  generatePixPayload(budget: any): string {
    const merchantKey = process.env.PIX_MERCHANT_KEY || 'chave-pix-aqui';
    const merchantName = process.env.PIX_MERCHANT_NAME || 'ServiceFlow';
    const amount = budget.total.toFixed(2);
    const description = `ORC ${budget.number}`;

    const payload = [
      '000201',
      '26580014br.gov.bcb.pix0136',
      merchantKey,
      '52040000',
      '5303986',
      `5405${amount.padStart(5, '0')}`,
      `5802BR`,
      `5915${merchantName.padEnd(15, ' ').substring(0, 15)}`,
      `6008BRASILIA`,
      `62070503***`,
      `6304`,
    ].join('');

    const crc16 = this.calculateCRC16(payload);
    return payload + crc16;
  }

  private calculateCRC16(payload: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;

    for (let i = 0; i < payload.length; i++) {
      crc ^= (payload.charCodeAt(i) << 8);
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ polynomial;
        } else {
          crc = crc << 1;
        }
        crc &= 0xFFFF;
      }
    }

    return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  }
}
