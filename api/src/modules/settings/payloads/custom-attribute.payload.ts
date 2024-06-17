import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { SearchRequest } from 'src/kernel';

export class CustomAttributePayload {
  @IsString()
  @IsNotEmpty()
  key: string;

  @IsOptional()
  @IsNotEmpty()
  value: any;

  @IsString()
  @IsNotEmpty()
  group: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class CustomAttributeSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  key: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  group: string;
}
