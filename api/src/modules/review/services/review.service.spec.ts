import { Test, TestingModule } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  EntityNotFoundException,
  MongoDBModule,
  MONGO_DB_PROVIDER
} from 'src/kernel';
import { ReviewService } from './review.service';
import { REVIEW_MODEL_PROVIDER } from '../constants';
import { schema } from '../review.schema';
import { ReviewExistedException } from '../exceptions';

require('dotenv').config();

describe('ReviewService', () => {
  let service: ReviewService;

  const sourceId = new ObjectId();
  const createdBy = new ObjectId();
  const data = {
    title: 'test',
    comment: 'ok',
    rating: 5,
    source: 'performer',
    sourceId
  } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MongoDBModule],
      providers: [
        ReviewService,
        {
          inject: [MONGO_DB_PROVIDER],
          provide: REVIEW_MODEL_PROVIDER,
          useFactory: (connection: Connection) => connection.model('review', schema)
        }
      ]
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be review', () => expect(service.create(data, createdBy)).resolves.toHaveProperty(
    '_id'
  ));

  it('should throw 400', () => expect(service.create(data, createdBy)).rejects.toThrowError(
    ReviewExistedException
  ));

  it('should throw entity not found excepction', () => expect(service.delete(null, null)).rejects.toThrowError(
    EntityNotFoundException
  ));
});
