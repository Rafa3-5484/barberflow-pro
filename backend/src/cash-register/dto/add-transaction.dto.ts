import {
  IsEnum,
  IsString,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { TransactionType, PaymentMethod } from '../../../generated/prisma/client.js';

export class AddTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;
}
