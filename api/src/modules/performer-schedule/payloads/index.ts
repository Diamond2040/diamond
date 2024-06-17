import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import { SearchRequest } from 'src/kernel';
import { STATUS } from 'src/kernel/constants';
// import { ObjectId } from 'mongodb';

export class SearchSchedulePayload extends SearchRequest {
  @ApiProperty()
  @IsString()
  @IsOptional()
  q: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: any;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn([STATUS.ACTIVE, STATUS.INACTIVE])
  status: string;
}

export class CreateSchedulePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn([STATUS.ACTIVE, STATUS.INACTIVE])
  status: string;
}

export class AdminCreateSchedulePayload extends CreateSchedulePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;
}

export class UpdateSchedulePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  startAt: Date;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  endAt: Date;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn([STATUS.ACTIVE, STATUS.INACTIVE])
  status: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isBooked: boolean;
}

export class AdminUpdateSchedulePayload extends UpdateSchedulePayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
  userId: string;
}
