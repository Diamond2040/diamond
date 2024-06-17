import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsNumber,
  IsIn
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ServiceSettingItemPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  service: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  time: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  include: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;
}

export class ServiceSettingPayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['services', 'rates'])
  group: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceSettingItemPayload)
  settings: ServiceSettingItemPayload[];
}
