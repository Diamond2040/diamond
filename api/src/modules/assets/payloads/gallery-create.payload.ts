import {
  IsString,
  IsOptional,
  IsIn,
  IsNotEmpty
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GalleryCreatePayload {
  @ApiProperty()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(['active', 'inactive', 'draft'])
  status: string;

  @ApiProperty()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  performerIds: string[];
}
