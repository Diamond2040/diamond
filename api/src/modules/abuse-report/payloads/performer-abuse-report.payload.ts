import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn, IsNotEmpty, IsOptional, IsString
} from 'class-validator';
import { SearchRequest } from 'src/kernel';
import { ABUSE_REPORT_CATEGORY_LIST } from '../constant';

export class PerformerAbuseReportPayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  targetId: string;

  @ApiProperty()
  @IsOptional()
  @IsIn(ABUSE_REPORT_CATEGORY_LIST)
  @IsString()
  category: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  comment: string;
}

export class PerformerAbuseReportSearchPayload extends SearchRequest {
  @ApiProperty()
  @IsOptional()
  @IsIn(ABUSE_REPORT_CATEGORY_LIST)
  @IsString()
  category?: string;
}
