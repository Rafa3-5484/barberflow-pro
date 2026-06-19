import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateStockItemDto } from './dto/create-stock-item.dto.js';
import { UpdateStockItemDto } from './dto/update-stock-item.dto.js';

@Injectable()
export class StockService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateStockItemDto) {
    return this.prisma.stockItem.create({
      data: {
        ...dto,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });
  }

  async findAll() {
    return this.prisma.stockItem.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.stockItem.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Stock item not found');
    return item;
  }

  async update(id: string, dto: UpdateStockItemDto) {
    await this.findOne(id);
    return this.prisma.stockItem.update({
      where: { id },
      data: {
        ...dto,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.stockItem.delete({ where: { id } });
  }

  async getAlerts() {
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const allItems = await this.prisma.stockItem.findMany();
    const lowStock = allItems.filter((item) => item.quantity <= item.minQuantity);

    const expiring = await this.prisma.stockItem.findMany({
      where: {
        expiryDate: {
          not: null,
          gte: now,
          lte: thirtyDaysFromNow,
        },
      },
    });

    return { lowStock, expiring };
  }
}
