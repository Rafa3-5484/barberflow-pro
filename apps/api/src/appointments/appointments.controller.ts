import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsController {
  constructor(private appointmentsService: AppointmentsService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.appointmentsService.findAll(companyId, query);
  }

  @Get('calendar')
  getCalendar(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.appointmentsService.getCalendar(companyId, query);
  }

  @Get('upcoming')
  getUpcoming(
    @CurrentUser('companyId') companyId: string,
    @Query('limit') limit: number,
  ) {
    return this.appointmentsService.getUpcoming(companyId, limit || 10);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.appointmentsService.create(companyId, userId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.appointmentsService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.delete(companyId, id);
  }

  @Patch(':id/confirm')
  confirm(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.confirm(companyId, id);
  }

  @Patch(':id/complete')
  complete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.complete(companyId, id);
  }

  @Patch(':id/cancel')
  cancel(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.appointmentsService.cancel(companyId, id);
  }

  @Patch(':id/reschedule')
  reschedule(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: { date: string; startTime: string; endTime: string },
  ) {
    return this.appointmentsService.reschedule(companyId, id, dto);
  }
}
