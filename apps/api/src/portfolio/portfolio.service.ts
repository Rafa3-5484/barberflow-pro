import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PortfolioService {
  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc', category, public: isPublic } = query;

    const where: Prisma.PortfolioItemWhereInput = { companyId };

    if (category) where.category = category;
    if (isPublic !== undefined) where.public = isPublic === 'true';

    const [data, total] = await Promise.all([
      this.prisma.portfolioItem.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sort]: order },
      }),
      this.prisma.portfolioItem.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async findOne(companyId: string, id: string) {
    const item = await this.prisma.portfolioItem.findFirst({
      where: { id, companyId },
    });

    if (!item) throw new NotFoundException('Portfolio item not found');
    return item;
  }

  async create(companyId: string, dto: any) {
    return this.prisma.portfolioItem.create({
      data: { ...dto, companyId },
    });
  }

  async update(companyId: string, id: string, dto: any) {
    const item = await this.prisma.portfolioItem.findFirst({
      where: { id, companyId },
    });

    if (!item) throw new NotFoundException('Portfolio item not found');

    return this.prisma.portfolioItem.update({
      where: { id },
      data: dto,
    });
  }

  async delete(companyId: string, id: string) {
    const item = await this.prisma.portfolioItem.findFirst({
      where: { id, companyId },
    });

    if (!item) throw new NotFoundException('Portfolio item not found');

    await this.prisma.portfolioItem.delete({ where: { id } });
    return { message: 'Portfolio item deleted successfully' };
  }

  async toggleVisibility(companyId: string, id: string) {
    const item = await this.prisma.portfolioItem.findFirst({
      where: { id, companyId },
    });

    if (!item) throw new NotFoundException('Portfolio item not found');

    return this.prisma.portfolioItem.update({
      where: { id },
      data: { public: !item.public },
    });
  }

  async uploadPhoto(companyId: string, file: Express.Multer.File) {
    const url = `/uploads/portfolio/${file.filename}`;
    return { url };
  }

  async getPublicPortfolio(companySlug: string) {
    const company = await this.prisma.company.findUnique({
      where: { slug: companySlug },
    });

    if (!company) throw new NotFoundException('Company not found');

    const items = await this.prisma.portfolioItem.findMany({
      where: { companyId: company.id, public: true },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: items,
      company: { name: company.name, slug: company.slug, logo: company.logo },
    };
  }
}
