import { IsString, IsOptional } from 'class-validator';
import { SearchRequest } from 'src/kernel/common';
import { ApiProperty } from '@nestjs/swagger';

export class PhotoSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  target: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  targetId: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status: string;
}
