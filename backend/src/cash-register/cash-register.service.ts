import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { OpenRegisterDto } from './dto/open-register.dto.js';
import { AddTransactionDto } from './dto/add-transaction.dto.js';

@Injectable()
export class CashRegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async open(dto: OpenRegisterDto, userId: string) {
    const openRegister = await this.prisma.cashRegister.findFirst({
      where: { status: 'OPEN' },
    });
    if (openRegister) {
      throw new BadRequestException('There is already an open cash register');
    }

    return this.prisma.cashRegister.create({
      data: {
        operatorId: userId,
        initialAmount: dto.initialAmount,
        currentAmount: dto.initialAmount,
      },
    });
  }

  async close(id: string) {
    const register = await this.prisma.cashRegister.findUnique({
      where: { id },
      include: { transactions: true },
    });
    if (!register) throw new NotFoundException('Cash register not found');
    if (register.status === 'CLOSED') {
      throw new BadRequestException('Cash register is already closed');
    }

    return this.prisma.cashRegister.update({
      where: { id },
      data: {
        status: 'CLOSED',
        closedAt: new Date(),
      },
    });
  }

  async addTransaction(id: string, dto: AddTransactionDto) {
    const register = await this.prisma.cashRegister.findUnique({
      where: { id },
    });
    if (!register) throw new NotFoundException('Cash register not found');
    if (register.status === 'CLOSED') {
      throw new BadRequestException('Cash register is closed');
    }

    const transaction = await this.prisma.transaction.create({
      data: {
        cashRegisterId: id,
        type: dto.type,
        description: dto.description,
        amount: dto.amount,
        paymentMethod: dto.paymentMethod,
      },
    });

    const amountChange =
      dto.type === 'INCOME' ? dto.amount : -dto.amount;

    await this.prisma.cashRegister.update({
      where: { id },
      data: {
        currentAmount: { increment: amountChange },
        totalIncome:
          dto.type === 'INCOME'
            ? { increment: dto.amount }
            : undefined,
        totalExpense:
          dto.type !== 'INCOME'
            ? { increment: dto.amount }
            : undefined,
      },
    });

    return transaction;
  }

  async getCurrent() {
    return this.prisma.cashRegister.findFirst({
      where: { status: 'OPEN' },
      include: {
        transactions: { orderBy: { createdAt: 'desc' } },
        operator: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async getHistory() {
    return this.prisma.cashRegister.findMany({
      include: {
        operator: { select: { id: true, name: true, email: true } },
        _count: { select: { transactions: true } },
      },
      orderBy: { openedAt: 'desc' },
    });
  }
}
