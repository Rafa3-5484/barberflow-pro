import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ProfessionalsModule } from './professionals/professionals.module.js';
import { ServicesModule } from './services/services.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { ClientsModule } from './clients/clients.module.js';
import { CashRegisterModule } from './cash-register/cash-register.module.js';
import { ReportsModule } from './reports/reports.module.js';
import { StockModule } from './stock/stock.module.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { WhatsAppModule } from './whatsapp/whatsapp.module.js';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ProfessionalsModule,
    ServicesModule,
    AppointmentsModule,
    ClientsModule,
    CashRegisterModule,
    ReportsModule,
    StockModule,
    NotificationsModule,
    WhatsAppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
