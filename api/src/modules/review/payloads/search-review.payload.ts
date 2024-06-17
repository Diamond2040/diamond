import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { SearchRequest } from 'src/kernel';

export class SearchReviewPayload extends SearchRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
  sourceId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  source: string;
}
