import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SearchRequest } from 'src/kernel';

export class UploadPerformerProfileImagePayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  performerId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class UpdatePerformerProfileImagePayload {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  performerId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;
}

export class SearchPerformerProfileImagePayload extends SearchRequest {
  @ApiProperty()
  @IsOptional()
  @IsString()
  performerId: string;
}
