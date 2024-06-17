import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class PerformerSearchPayload extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  q: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  age: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  fromAge: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  toAge: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  gender: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  categoryId: string;

  @ApiProperty()
  @IsOptional()
  categoryIds: string[];

  @ApiProperty()
  @IsOptional()
  includedIds: string[];

  @ApiProperty()
  @IsOptional()
  orientation: string;

  @ApiProperty()
  @IsOptional()
  height: string;

  @ApiProperty()
  @IsOptional()
  weight: string;

  @ApiProperty()
  @IsOptional()
  tattoo: string;

  @ApiProperty()
  @IsOptional()
  language: string;

  @ApiProperty()
  @IsOptional()
  meetingWith: string;

  @ApiProperty()
  @IsOptional()
  city: string;

  @ApiProperty()
  @IsOptional()
  vip: string;

  @ApiProperty()
  @IsOptional()
  service: string;

  @ApiProperty()
  @IsOptional()
  ethnicity: string;

  @ApiProperty()
  @IsOptional()
  hairColor: string;
}
