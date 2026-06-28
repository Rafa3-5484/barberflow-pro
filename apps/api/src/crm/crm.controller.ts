import {
  Controller, Get, Post, Put, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { CRMModule as CRMService } from './crm.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('crm')
export class CRMController {
  constructor(private crmService: CRMService) {}

  @Get('client/:clientId/timeline')
  getTimeline(
    @CurrentUser('companyId') companyId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.crmService.getTimeline(companyId, clientId);
  }

  @Get('client/:clientId/insights')
  getInsights(
    @CurrentUser('companyId') companyId: string,
    @Param('clientId') clientId: string,
  ) {
    return this.crmService.getClientInsights(companyId, clientId);
  }

  @Post('client/:clientId/activity')
  addActivity(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Param('clientId') clientId: string,
    @Body() dto: { type: any; description: string; metadata?: any },
  ) {
    return this.crmService.addActivity(companyId, clientId, userId, dto);
  }

  @Put('activity/:id')
  updateActivity(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.crmService.updateActivity(companyId, id, dto);
  }

  @Delete('activity/:id')
  deleteActivity(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.crmService.deleteActivity(companyId, id);
  }
}
