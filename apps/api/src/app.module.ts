import { Module } from '@nestjs/common';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { BudgetsModule } from './budgets/budgets.module';
import { FinancialModule } from './financial/financial.module';
import { RoutesModule } from './routes/routes.module';
import { CRMModule } from './crm/crm.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AutomationsModule } from './automations/automations.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TeamModule } from './team/team.module';
import { UploadModule } from './upload/upload.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api/(.*)'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ClientsModule,
    AppointmentsModule,
    BudgetsModule,
    FinancialModule,
    RoutesModule,
    CRMModule,
    PortfolioModule,
    ReviewsModule,
    AutomationsModule,
    WhatsAppModule,
    NotificationsModule,
    TeamModule,
    UploadModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
