import {
  IsString, IsNumber, Min, IsOptional, IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookingUpdatePayload {
  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startAt?: string;
}
