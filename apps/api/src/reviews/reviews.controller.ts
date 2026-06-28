import {
  Controller, Get, Post, Patch, Param, Query, Body, UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';

@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  findAll(
    @CurrentUser('companyId') companyId: string,
    @Query() query: any,
  ) {
    return this.reviewsService.findAll(companyId, query);
  }

  @Get('stats')
  getStats(@CurrentUser('companyId') companyId: string) {
    return this.reviewsService.getStats(companyId);
  }

  @Get(':id')
  findOne(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
  ) {
    return this.reviewsService.findOne(companyId, id);
  }

  @Post()
  create(
    @CurrentUser('companyId') companyId: string,
    @Body() dto: any,
  ) {
    return this.reviewsService.create(companyId, dto);
  }

  @Patch(':id/respond')
  respond(
    @CurrentUser('companyId') companyId: string,
    @Param('id') id: string,
    @Body('response') response: string,
  ) {
    return this.reviewsService.respond(companyId, id, response);
  }

  @Public()
  @Get('public/:companySlug')
  getPublic(@Param('companySlug') companySlug: string) {
    return this.reviewsService.getPublicReviews(companySlug);
  }
}
