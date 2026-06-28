import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', rating, public: isPublic, responded } = query;

    const where: Prisma.ReviewWhereInput = { companyId };

    if (rating) where.rating = parseInt(rating);
    if (isPublic !== undefined) where.public = isPublic === 'true';
    if (responded !== undefined) where.responded = responded === 'true';

    const [data, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
        include: {
          client: { select: { id: true, name: true } },
          appointment: { select: { id: true, title: true } },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async findOne(companyId: string, id: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, companyId },
      include: {
        client: true,
        appointment: true,
      },
    });

    if (!review) throw new NotFoundException('Review not found');
    return review;
  }

  async create(companyId: string, dto: any) {
    const appointment = await this.prisma.appointment.findFirst({
      where: { id: dto.appointmentId, companyId },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    const existingReview = await this.prisma.review.findFirst({
      where: { appointmentId: dto.appointmentId },
    });

    if (existingReview) {
      throw new BadRequestException('This appointment already has a review');
    }

    return this.prisma.review.create({
      data: { ...dto, companyId },
      include: {
        client: { select: { id: true, name: true } },
      },
    });
  }

  async respond(companyId: string, id: string, response: string) {
    const review = await this.prisma.review.findFirst({
      where: { id, companyId },
    });

    if (!review) throw new NotFoundException('Review not found');

    return this.prisma.review.update({
      where: { id },
      data: { response, responded: true, respondedAt: new Date() },
    });
  }

  async getStats(companyId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { companyId },
    });

    const total = reviews.length;
    if (total === 0) {
      return { total: 0, averageRating: 0, distribution: {}, nps: 0 };
    }

    const averageRating = reviews.reduce((s, r) => s + r.rating, 0) / total;

    const distribution: Record<number, number> = {};
    reviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    const promoters = reviews.filter((r) => r.rating >= 9).length;
    const detractors = reviews.filter((r) => r.rating <= 6).length;
    const nps = ((promoters - detractors) / total) * 100;

    return { total, averageRating, distribution, nps: Math.round(nps) };
  }

  async getPublicReviews(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) throw new NotFoundException('Company not found');

    const reviews = await this.prisma.review.findMany({
      where: { companyId: company.id, public: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        client: { select: { id: true, name: true } },
      },
    });

    const stats = await this.getStats(company.id);

    return {
      data: reviews,
      stats,
      company: { name: company.name, slug: company.slug, logo: company.logo },
    };
  }
}
