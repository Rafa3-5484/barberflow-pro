import {
  Controller, Get, Post, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { WhatsAppService } from './whatsapp.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@Controller('whatsapp')
export class WhatsAppController {
  constructor(private whatsappService: WhatsAppService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  sendMessage(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: { to: string; body: string; mediaUrl?: string },
  ) {
    return this.whatsappService.sendMessage(companyId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('send-template')
  sendTemplate(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: { to: string; templateName: string; params: Record<string, string> },
  ) {
    return this.whatsappService.sendTemplate(companyId, dto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async webhook(
    @Query('companyId') companyId: string,
    @Body() body: any,
  ) {
    const cid = companyId || 'default';
    return this.whatsappService.processWebhook(cid, body);
  }

  @Public()
  @Get('webhook')
  async verifyWebhook(@Query() query: any) {
    return this.whatsappService.verifyWebhook(query);
  }
}
