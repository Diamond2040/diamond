import { ObjectId } from 'mongodb';
import { PerformerDto } from 'src/modules/performer/dtos';
import { Expose } from 'class-transformer';

export class PerformerScheduleDto {
  @Expose()
  _id: ObjectId;

  @Expose()
  userId: ObjectId;

  @Expose()
  performer: PerformerDto;

  @Expose()
  name: string;

  @Expose()
  price: number;

  @Expose()
  description: string;

  @Expose()
  status: string;

  @Expose()
  isBooked: boolean;

  @Expose()
  startAt: Date;

  @Expose()
  endAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
