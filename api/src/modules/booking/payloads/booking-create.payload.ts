import {
  IsString, IsNotEmpty, IsNumber, Min, IsOptional, IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookingCreatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  scheduleId: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @IsOptional()
  duration: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty()
  @IsDateString()
  @IsOptional()
  startAt: string;
}
