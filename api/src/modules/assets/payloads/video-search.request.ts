import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class VideoSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  performerId: string;

  @ApiProperty()
  @IsOptional()
  performerIds: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  excludedId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  isSale: string;

  @ApiProperty()
  @IsOptional()
  isSchedule: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  categoryIds: string[];
}
