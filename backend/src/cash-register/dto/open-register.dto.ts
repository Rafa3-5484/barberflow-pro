import { IsNumber, Min, IsOptional } from 'class-validator';

export class OpenRegisterDto {
  @IsNumber()
  @Min(0)
  initialAmount: number;
}
