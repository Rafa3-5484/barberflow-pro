import { IsEnum } from 'class-validator';
import { AppointmentStatus } from '../../../generated/prisma/client.js';

export class UpdateStatusDto {
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
