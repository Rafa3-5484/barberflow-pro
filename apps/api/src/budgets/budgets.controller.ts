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
  Res,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { BudgetsService } from './budgets.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.budgetsService.findAll(companyId, query);
  }

  @Get('last-number')
  getLastNumber(@CurrentUser('companyId') companyId: string) {
    return this.budgetsService.getLastNumber(companyId);
  }

  @Public()
  @Get(':id/pdf')
  async generatePdf(
    @Param('id') id: string,
    @CurrentUser('companyId') companyId: string,
    @Res() res: Response,
  ) {
    const html = await this.budgetsService.generatePdf(companyId, id);
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: any,
  ) {
    return this.budgetsService.create(companyId, userId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.budgetsService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.delete(companyId, id);
  }

  @Patch(':id/send')
  send(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.send(companyId, id);
  }

  @Patch(':id/accept')
  accept(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: { signature?: string; ip?: string; lat?: number; lng?: number },
    @Req() req: any,
  ) {
    return this.budgetsService.accept(companyId, id, {
      ...dto,
      ip: dto.ip || req.ip,
    });
  }

  @Patch(':id/reject')
  reject(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.reject(companyId, id);
  }

  @Post(':id/duplicate')
  duplicate(
    @CurrentUser('companyId') companyId: string,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.budgetsService.duplicate(companyId, userId, id);
  }
}
