import {
  Controller, Get, Patch, Delete, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Query() query: any,
  ) {
    return this.notificationsService.getUserNotifications(companyId, userId, query);
  }

  @Get('unread-count')
  unreadCount(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.getUnreadCount(companyId, userId);
  }

  @Patch(':id/read')
  markAsRead(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.markAsRead(companyId, userId, id);
  }

  @Patch('read-all')
  markAllAsRead(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.notificationsService.markAllAsRead(companyId, userId);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.notificationsService.delete(companyId, userId, id);
  }
}
