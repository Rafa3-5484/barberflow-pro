import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CashRegisterService } from './cash-register.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { OpenRegisterDto } from './dto/open-register.dto.js';
import { AddTransactionDto } from './dto/add-transaction.dto.js';

@Controller('cash-register')
@UseGuards(JwtAuthGuard)
export class CashRegisterController {
  constructor(
    private readonly cashRegisterService: CashRegisterService,
  ) {}

  @Post('open')
  async open(@Body() dto: OpenRegisterDto, @CurrentUser() user: any) {
    return this.cashRegisterService.open(dto, user.id);
  }

  @Post('close/:id')
  async close(@Param('id') id: string) {
    return this.cashRegisterService.close(id);
  }

  @Post('transaction')
  async addTransaction(
    @Body() body: { cashRegisterId: string } & AddTransactionDto,
  ) {
    const { cashRegisterId, ...dto } = body;
    return this.cashRegisterService.addTransaction(cashRegisterId, dto);
  }

  @Get('current')
  async getCurrent() {
    return this.cashRegisterService.getCurrent();
  }

  @Get('history')
  async getHistory() {
    return this.cashRegisterService.getHistory();
  }
}
