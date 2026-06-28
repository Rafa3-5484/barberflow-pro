import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private clientsService: ClientsService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.clientsService.findAll(companyId, query);
  }

  @Get('stats')
  getStats(@CurrentUser('companyId') companyId: string) {
    return this.clientsService.getStats(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.clientsService.findOne(companyId, id);
  }

  @Get(':id/timeline')
  getTimeline(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.clientsService.getTimeline(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: any,
  ) {
    return this.clientsService.create(companyId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.clientsService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.clientsService.delete(companyId, id);
  }
}
