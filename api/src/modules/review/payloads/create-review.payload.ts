import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min
} from 'class-validator';
import { ObjectId } from 'mongodb';
import { REVIEW_SOURCE } from '../constants';
import { ReviewSourceType } from '../interfaces';

export class CreateReviewPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsIn(REVIEW_SOURCE)
  source: ReviewSourceType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  sourceId: ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}
