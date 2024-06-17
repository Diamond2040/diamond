import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable
} from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { EntityNotFoundException, PageableData } from 'src/kernel';
import { merge, uniq } from 'lodash';
import { ObjectId } from 'mongodb';
import { UserDto } from 'src/modules/user/dtos';
import * as moment from 'moment';
import { plainToClass } from 'class-transformer';
import { UserService } from 'src/modules/user/services';
import { isObjectId } from 'src/kernel/helpers/string.helper';
import {
  SearchSchedulePayload,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  AdminCreateSchedulePayload,
  AdminUpdateSchedulePayload
} from '../payloads';
import { ScheduleModel } from '../models';
import { PERFORMER_SCHEDULE_PROVIDER } from '../providers';
import { PerformerScheduleDto } from '../dtos';

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(PERFORMER_SCHEDULE_PROVIDER)
    private readonly scheduleModel: Model<ScheduleModel>,
    private readonly userService: UserService
  ) {}

  async findByIds(Ids: string[] | ObjectId[]) {
    const data = await this.scheduleModel.find({ _id: { $in: Ids } });
    return data;
  }

  async findById(id: string | ObjectId) {
    return this.scheduleModel.findOne({ _id: id });
  }

  async findOne(id: string | ObjectId): Promise<PerformerScheduleDto> {
    const schedule = await this.scheduleModel.findOne({ _id: id }).lean();
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    const { userId } = schedule;
    const performer = userId && (await this.userService.findById(userId));
    return plainToClass(PerformerScheduleDto, { ...schedule, performer });
  }

  async create(
    payload: CreateSchedulePayload,
    currentUser: UserDto
  ): Promise<PerformerScheduleDto> {
    if (moment(payload.startAt) < moment()) {
      throw new HttpException('Please choose a future date', HttpStatus.BAD_REQUEST);
    }

    if (moment(payload.startAt) > moment(payload.endAt)) {
      throw new BadRequestException();
    }

    const count = await this.scheduleModel.countDocuments({
      userId: currentUser._id,
      $and: [
        { endAt: { $gte: payload.startAt } },
        { startAt: { $lte: payload.startAt } }
      ]
    });
    if (count) {
      throw new HttpException('Invalid start time', HttpStatus.BAD_REQUEST);
    }

    const data = { ...payload, userId: currentUser._id };
    const schedule = await this.scheduleModel.create(data);
    return plainToClass(PerformerScheduleDto, schedule.toObject());
  }

  async adminCreate(
    payload: AdminCreateSchedulePayload
  ): Promise<PerformerScheduleDto> {
    if (moment(payload.startAt) > moment(payload.endAt)) {
      throw new BadRequestException();
    }

    const count = await this.scheduleModel.countDocuments({
      userId: payload.userId,
      $and: [
        { endAt: { $gte: payload.startAt } },
        { startAt: { $lte: payload.startAt } }
      ]
    });
    if (count) {
      throw new HttpException('Invalid start time', HttpStatus.BAD_REQUEST);
    }

    const data = { ...payload };
    const schedule = await this.scheduleModel.create(data);
    return plainToClass(PerformerScheduleDto, schedule.toObject());
  }

  async search(
    req: SearchSchedulePayload
  ): Promise<PageableData<PerformerScheduleDto>> {
    const query: FilterQuery<ScheduleModel> = {};

    if (req.q) {
      const regexp = new RegExp(
        req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
        'i'
      );
      query.$or = [
        {
          name: { $regex: regexp }
        },
        {
          description: { $regex: regexp }
        }
      ];
    }

    if (req.status) query.status = req.status;
    if (isObjectId(req.userId)) query.userId = req.userId;
    if (req.startAt && req.endAt) {
      query.startAt = { $gt: moment(req.startAt).startOf('date').toDate() };
      query.endAt = { $lt: moment(req.endAt).endOf('date').toDate() };
    }

    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || 'desc'
    };

    const [schedules, total] = await Promise.all([
      this.scheduleModel
        .find(query)
        .sort(sort)
        .lean()
        .limit(parseInt(req.limit as string, 10))
        .skip(parseInt(req.offset as string, 10)),
      this.scheduleModel.countDocuments(query)
    ]);

    const userIds = uniq(schedules.map((d) => d.userId));
    const users = await this.userService.findByIds(userIds);
    const data = schedules.map((schedule) => {
      const user = schedule.userId && users.find((d) => d._id.equals(schedule.userId));
      if (user) {
        return plainToClass(PerformerScheduleDto, {
          ...schedule,
          performer: new UserDto(user).toResponse()
        });
      }

      return plainToClass(PerformerScheduleDto, schedule);
    });
    return { data, total };
  }

  async update(
    id: string | ObjectId,
    payload: UpdateSchedulePayload,
    currentUser: UserDto
  ): Promise<PerformerScheduleDto> {
    const schedule = await this.findById(id);
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    if (!schedule.userId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    if (payload.startAt && moment(payload.startAt) < moment()) {
      throw new HttpException('Please choose a future date', HttpStatus.BAD_REQUEST);
    }

    if (payload.startAt && moment(payload.startAt) > moment(payload.endAt)) {
      throw new BadRequestException();
    }

    if (payload.startAt) {
      const count = await this.scheduleModel.countDocuments({
        userId: schedule.userId,
        $and: [
          { endAt: { $gte: payload.startAt } },
          { startAt: { $lte: payload.startAt } }
        ],
        _id: { $ne: id }
      });
      if (count) {
        throw new HttpException('Invalid start time', HttpStatus.BAD_REQUEST);
      }
    }

    merge(schedule, payload);
    schedule.updatedAt = new Date();
    await schedule.save();
    return plainToClass(PerformerScheduleDto, schedule.toObject());
  }

  async adminUpdate(
    id: string | ObjectId,
    payload: AdminUpdateSchedulePayload
  ): Promise<PerformerScheduleDto> {
    const schedule = await this.findById(id);
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    if (moment(payload.startAt) > moment(payload.endAt)) {
      throw new BadRequestException();
    }

    const count = await this.scheduleModel.countDocuments({
      userId: payload.userId,
      $and: [
        { endAt: { $gte: payload.startAt } },
        { startAt: { $lte: payload.startAt } }
      ]
    });
    if (count) {
      throw new HttpException('Invalid start time', HttpStatus.BAD_REQUEST);
    }

    merge(schedule, payload);
    schedule.updatedAt = new Date();
    await schedule.save();
    return plainToClass(PerformerScheduleDto, schedule.toObject());
  }

  async delete(id: string | ObjectId, currentUser: UserDto) {
    const schedule = await this.findById(id);
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    if (!schedule.userId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    await schedule.remove();
    return true;
  }

  async adminDelete(id: string | ObjectId) {
    const schedule = await this.findById(id);
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    await schedule.remove();
    return true;
  }
}
