import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  IsOptional,
  Validate,
  IsIn,
  IsArray
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Username } from 'src/modules/user/validators/username.validator';
import { GENDERS } from 'src/modules/user/constants';

export class PerformerRegisterPayload {
  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty()
  @IsString()
  @Validate(Username)
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @IsIn(GENDERS)
  gender: string;

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
  // @IsArray()
  // @IsString({ each: true })
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
  // @IsArray()
  // @IsString({ each: true })
  meetingWith?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  nickName?: string;

  @ApiProperty()
  @IsOptional()
  dateOfBirth?: Date;

  @ApiProperty()
  @IsOptional()
  @IsString()
  smoker?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  tattoo?: string;
}
