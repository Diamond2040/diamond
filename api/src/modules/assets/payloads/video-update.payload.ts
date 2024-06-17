import {
  IsString, IsOptional, IsIn
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class VideoUpdatePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
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
  tags: string[];

  @ApiProperty()
  @IsOptional()
  isSchedule: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  scheduledAt: Date;

  @ApiProperty()
  @IsOptional()
  isSale: boolean;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  performerIds: ObjectId[];

  @ApiProperty()
  @IsOptional()
  categoryIds: ObjectId[];
}
