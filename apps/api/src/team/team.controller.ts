import {
  Controller, Get, Post, Put, Delete, Patch, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('team')
export class TeamController {
  constructor(private teamService: TeamService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.teamService.findAll(companyId, query);
  }

  @Get('stats')
  getStats(@CurrentUser('companyId') companyId: string) {
    return this.teamService.getStats(companyId);
  }

  @Post('invite')
  invite(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: any,
  ) {
    return this.teamService.invite(companyId, dto);
  }

  @Get(':id/schedule')
  getSchedule(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Query('date') date?: string,
  ) {
    return this.teamService.getTechnicianSchedule(companyId, id, date);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.teamService.update(companyId, id, dto);
  }

  @Delete(':id')
  deactivate(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.teamService.deactivate(companyId, id);
  }

  @Patch(':id/commission')
  updateCommission(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body('commission') commission: number,
  ) {
    return this.teamService.updateCommission(companyId, id, commission);
  }
}
