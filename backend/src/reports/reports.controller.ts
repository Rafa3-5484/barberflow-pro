import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../common/guards/roles.guard.js';
import { Roles } from '../common/decorators/roles.decorator.js';

@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily')
  async daily(@Query('date') date: string) {
    return this.reportsService.daily(date || new Date().toISOString().split('T')[0]);
  }

  @Get('weekly')
  async weekly(@Query('date') date: string) {
    return this.reportsService.weekly(date || new Date().toISOString().split('T')[0]);
  }

  @Get('monthly')
  async monthly(@Query('date') date: string) {
    return this.reportsService.monthly(date || new Date().toISOString().split('T')[0]);
  }

  @Get('annual')
  async annual(@Query('year') year: string) {
    return this.reportsService.annual(parseInt(year) || new Date().getFullYear());
  }

  @Get('dashboard')
  @Roles('ADMIN', 'MANAGER')
  async dashboard() {
    return this.reportsService.dashboard();
  }
}
