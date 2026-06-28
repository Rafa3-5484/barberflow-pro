import {
  Controller, Get, Post, Put, Delete, Patch, Param, Query, Body, UseGuards, UseInterceptors, UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private portfolioService: PortfolioService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.portfolioService.findAll(companyId, query);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(
    @CurrentUser('companyId') companyId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.portfolioService.uploadPhoto(companyId, file);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.portfolioService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: any,
  ) {
    return this.portfolioService.create(companyId, dto);
  }

  @Put(':id')
  update(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body() dto: any,
  ) {
    return this.portfolioService.update(companyId, id, dto);
  }

  @Delete(':id')
  delete(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.portfolioService.delete(companyId, id);
  }

  @Patch(':id/visibility')
  toggleVisibility(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.portfolioService.toggleVisibility(companyId, id);
  }

  @Public()
  @Get('public/:companySlug')
  getPublic(@Param('companySlug') companySlug: string) {
    return this.portfolioService.getPublicPortfolio(companySlug);
  }
}
