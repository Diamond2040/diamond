import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsBoolean,
  IsNumber
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MenuCreatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  path: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  section: string;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  internal: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  parentId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  help: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ordering: number;

  @ApiProperty()
  @IsBoolean()
  isNewTab: boolean;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  icon: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  hideLoggedIn: boolean;
}
