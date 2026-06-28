import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, AutomationTrigger } from '@prisma/client';

@Injectable()
export class AutomationsService {
  private readonly logger = new Logger(AutomationsService.name);

  constructor(private prisma: PrismaService) {}

  async findAll(companyId: string, query: any = {}) {
    const { page = 1, limit = 10, trigger, active } = query;

    const where: Prisma.AutomationWhereInput = { companyId };

    if (trigger) where.trigger = trigger as AutomationTrigger;
    if (active !== undefined) where.active = active === 'true';

    const [data, total] = await Promise.all([
      this.prisma.automation.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.automation.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit), hasNext: page < Math.ceil(total / limit), hasPrevious: page > 1 },
    };
  }

  async findOne(companyId: string, id: string) {
    const automation = await this.prisma.automation.findFirst({
      where: { id, companyId },
    });

    if (!automation) throw new NotFoundException('Automation not found');
    return automation;
  }

  async create(companyId: string, dto: any) {
    return this.prisma.automation.create({
      data: { ...dto, companyId },
    });
  }

  async update(companyId: string, id: string, dto: any) {
    const automation = await this.prisma.automation.findFirst({
      where: { id, companyId },
    });

    if (!automation) throw new NotFoundException('Automation not found');

    return this.prisma.automation.update({
      where: { id },
      data: dto,
    });
  }

  async delete(companyId: string, id: string) {
    const automation = await this.prisma.automation.findFirst({
      where: { id, companyId },
    });

    if (!automation) throw new NotFoundException('Automation not found');

    await this.prisma.automation.delete({ where: { id } });
    return { message: 'Automation deleted successfully' };
  }

  async toggle(companyId: string, id: string) {
    const automation = await this.prisma.automation.findFirst({
      where: { id, companyId },
    });

    if (!automation) throw new NotFoundException('Automation not found');

    return this.prisma.automation.update({
      where: { id },
      data: { active: !automation.active },
    });
  }

  async executeAutomation(trigger: AutomationTrigger, data: any) {
    const automations = await this.prisma.automation.findMany({
      where: { trigger, active: true },
      include: { company: true },
    });

    for (const automation of automations) {
      try {
        const actions = automation.actions as any[];
        for (const action of actions) {
          await this.processAction(action, { ...data, company: automation.company });
        }
      } catch (error) {
        this.logger.error(`Failed to execute automation ${automation.id}: ${error}`);
      }
    }
  }

  private async processAction(action: any, data: any) {
    switch (action.type) {
      case 'send_whatsapp':
        this.logger.log(`Sending WhatsApp to ${data.client?.phone}: ${action.message}`);
        break;
      case 'send_email':
        this.logger.log(`Sending email to ${data.client?.email}: ${action.subject}`);
        break;
      case 'create_notification':
        this.logger.log(`Creating notification for ${data.userId}`);
        break;
      case 'update_status':
        this.logger.log(`Updating status to ${action.status}`);
        break;
      default:
        this.logger.warn(`Unknown action type: ${action.type}`);
    }
  }
}
