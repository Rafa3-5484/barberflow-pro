import {
  Controller, Get, Post, Put, Delete, Patch, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('automations')
export class AutomationsController {
  constructor(private automationsService: AutomationsService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.automationsService.findAll(companyId, query);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.automationsService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: any,
  ) {
    return this.automationsService.create(companyId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.automationsService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.automationsService.delete(companyId, id);
  }

  @Patch(':id/toggle')
  toggle(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.automationsService.toggle(companyId, id);
  }
}
