import {
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty,
  IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class GalleryUpdatePayload {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

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
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  performerIds: ObjectId[];

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categoryIds: ObjectId[];
}
