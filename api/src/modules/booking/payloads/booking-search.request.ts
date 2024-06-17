import {
  IsString, IsOptional, IsIn, IsDateString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SearchRequest } from 'src/kernel';
import { BOOKING_STATUS } from '../constants';

export class BookingSearchRequest extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  fromSourceId: any;

  @ApiProperty()
  @IsString()
  @IsOptional()
  targetId: any;

  @ApiProperty()
  @IsString()
  @IsIn([BOOKING_STATUS.CREATED, BOOKING_STATUS.ACCEPTED, BOOKING_STATUS.REJECT, BOOKING_STATUS.PENDING])
  @IsOptional()
  status: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endAt: Date;
}
