import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';
import { MessageCreatePayload } from './message-create.payload';

export class PrivateMessageCreatePayload extends MessageCreatePayload {
  @ApiProperty()
  @IsOptional()
  @IsString()
  recipientId: ObjectId;

  @ApiProperty()
  @IsOptional()
  @IsString()
  recipientType: string;
}
