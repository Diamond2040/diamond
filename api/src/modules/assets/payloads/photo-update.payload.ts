import {
  IsString,
  IsOptional,
  IsIn
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoUpdatePayload {
  @ApiProperty()
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
  price: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  targetId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  target: string;
}
