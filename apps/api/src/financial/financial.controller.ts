import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { FinancialService } from './financial.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('financial')
export class FinancialController {
  constructor(private financialService: FinancialService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.financialService.findAll(companyId, query);
  }

  @Get('dashboard')
  getDashboard(@CurrentUser('companyId') companyId: string) {
    return this.financialService.getDashboard(companyId);
  }

  @Get('indicators')
  getIndicators(@CurrentUser('companyId') companyId: string) {
    return this.financialService.getIndicators(companyId);
  }

  @Get('receivables')
  getReceivables(@CurrentUser('companyId') companyId: string) {
    return this.financialService.getReceivables(companyId);
  }

  @Get('report')
  getReport(
    @CurrentUser('companyId') companyId: string,
    @Query() query: { dateFrom?: string; dateTo?: string; type?: string },
  ) {
    return this.financialService.getReport(companyId, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.financialService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: any,
  ) {
    return this.financialService.create(companyId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.financialService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.financialService.delete(companyId, id);
  }
}
