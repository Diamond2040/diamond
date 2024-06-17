/* eslint-disable camelcase */
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean
} from 'class-validator';

export class SubscriptionPackageCreatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ordering: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  initialPeriod: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  recurringPrice: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  recurringPeriod: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  membershipType: string;
}
