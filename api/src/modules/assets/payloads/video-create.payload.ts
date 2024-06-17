import {
  IsString, IsOptional, IsIn, IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VideoCreatePayload {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status: string;

  @ApiProperty()
  @IsOptional()
  isSale: boolean;

  @ApiProperty()
  @IsOptional()
  isSchedule: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  scheduledAt: Date;

  @ApiProperty()
  @IsOptional()
  tags: string[];

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  performerIds: string[];

  @ApiProperty()
  @IsOptional()
  categoryIds: string[];
}
