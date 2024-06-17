import {
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoCreatePayload {
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
  // @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  tagetId: string;
}
