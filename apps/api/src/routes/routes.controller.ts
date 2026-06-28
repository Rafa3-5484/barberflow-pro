import {
  Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { RoutesService } from './routes.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('routes')
export class RoutesController {
  constructor(private routesService: RoutesService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.routesService.findAll(companyId, query);
  }

  @Get('today')
  getToday(@CurrentUser('companyId') companyId: string) {
    return this.routesService.getTodayRoutes(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.routesService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.routesService.create(companyId, userId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.routesService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.routesService.delete(companyId, id);
  }

  @Post(':id/optimize')
  optimize(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.routesService.optimize(companyId, id);
  }
}
