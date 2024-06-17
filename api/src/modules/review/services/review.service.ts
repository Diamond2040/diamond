import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { FilterQuery, Model } from 'mongoose';
import {
  EntityNotFoundException,
  PageableData,
  QueueEventService
} from 'src/kernel';
import { ObjectId } from 'mongodb';
import { UserService } from 'src/modules/user/services';
import { pick, uniq } from 'lodash';
import { EVENT } from 'src/kernel/constants';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import { REVIEW_CHANNEL, REVIEW_MODEL_PROVIDER } from '../constants';
import { ReviewDto } from '../dtos';
import { ReviewExistedException } from '../exceptions';
import { CreateReviewPayload, SearchReviewPayload } from '../payloads';
import { Review } from '../review.model';

@Injectable()
export class ReviewService {
  constructor(
    @Inject(REVIEW_MODEL_PROVIDER)
    private readonly _ReviewModel: Model<Review>,
    private readonly _UserSerVice: UserService,
    private readonly _QueueEventService: QueueEventService
  ) {}

  public async create(
    payload: CreateReviewPayload,
    createdBy: ObjectId
  ): Promise<ReviewDto> {
    const { sourceId, source } = payload;
    const checkExisted = await this._ReviewModel.countDocuments({
      createdBy,
      sourceId,
      source
    });
    if (checkExisted) {
      throw new ReviewExistedException('You have already rated this escort!');
    }

    const result = await this._ReviewModel.create({ ...payload, createdBy });
    await this._QueueEventService.publish({
      channel: REVIEW_CHANNEL,
      eventName: EVENT.CREATED,
      data: pick(result, ['source', 'sourceId', 'rating'])
    });
    return plainToClass(ReviewDto, result.toObject());
  }

  public async delete(id: string | ObjectId, createdBy: ObjectId) {
    const review = await this._ReviewModel.findById(id);
    if (!review) {
      throw new EntityNotFoundException();
    }

    if (!review.createdBy.equals(createdBy)) {
      throw new ForbiddenException();
    }

    return this._ReviewModel.deleteOne({ _id: id });
  }

  public async search(
    payload: SearchReviewPayload
  ): Promise<PageableData<ReviewDto>> {
    const query: FilterQuery<Review> = {};
    const sort = {
      [payload.sortBy || 'rating']: payload.sort || 'desc'
    };

    if (payload.source) query.source = payload.source as any;
    if (isObjectId(payload.sourceId as string)) query.sourceId = payload.sourceId as any;

    const [results, total] = await Promise.all([
      this._ReviewModel
        .find(query)
        .sort(sort)
        .limit(+payload.limit)
        .skip(+payload.offset)
        .lean(),
      this._ReviewModel.countDocuments(query)
    ]);

    const userIds = uniq(results.map((result) => result.createdBy));
    const reviewers = await this._UserSerVice.findByIds(userIds);

    return {
      data: results.map((result) => {
        const reviewer = reviewers.find((d) => d._id.equals(result.createdBy));
        if (reviewer) {
          return plainToClass(ReviewDto, {
            ...result,
            reviewer: reviewer.toResponse()
          });
        }

        return plainToClass(ReviewDto, result);
      }),
      total
    };
  }
}
