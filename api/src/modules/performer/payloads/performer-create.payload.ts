import {
  IsString,
  IsOptional,
  Validate,
  IsEmail,
  IsNotEmpty,
  IsIn,
  IsArray,
  IsDateString,
  IsBoolean
} from 'class-validator';
import { Username } from 'src/modules/user/validators/username.validator';
import { GENDERS } from 'src/modules/user/constants';
import { ApiProperty } from '@nestjs/swagger';
import { PERFORMER_STATUSES } from '../constants';

export class PerformerCreatePayload {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Validate(Username)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsIn([
    PERFORMER_STATUSES.ACTIVE,
    PERFORMER_STATUSES.INACTIVE,
    PERFORMER_STATUSES.WAIRING_FOR_REVIEW
  ])
  @IsOptional()
  status = PERFORMER_STATUSES.ACTIVE;

  @ApiProperty()
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  phoneCode?: string; // international code prefix

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(GENDERS)
  gender?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  zipcode?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categoryIds?: string[];

  @ApiProperty()
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  weight?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  eyes?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bustSize?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  ethnicity?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  hairColor?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  hairLength?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  bustType?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  orientation?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  aboutMe?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  travels?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string;

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  provides?: string[];

  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  meetingWith?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nationality?: string;

  @ApiProperty()
  @IsOptional()
  @IsDateString()
  dateOfBirth?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  smoker?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tattoo?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  introVideoLink?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  vip: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  verified: boolean;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  verifiedEmail: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  currency: string;
}
