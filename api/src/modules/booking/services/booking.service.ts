import {
  Injectable,
  Inject,
  forwardRef,
  ForbiddenException,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { FilterQuery, LeanDocument, Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import {
  AgendaService,
  EntityNotFoundException,
  PageableData,
  QueueEventService
} from 'src/kernel';
import { merge, uniq } from 'lodash';
import { UserDto } from 'src/modules/user/dtos';
import { ScheduleService } from 'src/modules/performer-schedule/services';
import { UserService } from 'src/modules/user/services';
import { PerformerDto } from 'src/modules/performer/dtos';
import * as moment from 'moment';
import { MailerService } from 'src/modules/mailer';
import { plainToClass } from 'class-transformer';
import { PerformerScheduleDto } from 'src/modules/performer-schedule/dtos';
import { EVENT } from 'src/kernel/constants';
import { isObjectId, toObjectId } from 'src/kernel/helpers/string.helper';
import { BookingDto } from '../dtos';
import {
  BookingCreatePayload,
  BookingSearchRequest,
  BookingUpdatePayload
} from '../payloads';
import { BookingModel } from '../models';
import { BOOKING_SCHEDULE_PROVIDER } from '../providers';
import { BOOKING_CHANNEL, BOOKING_STATUS } from '../constants';
import { BookingStatusType } from '../booking.interface';

const EMAIL_REMINDER_FOR_BOOKING = 'EMAIL_REMINDER_FOR_BOOKING';

@Injectable()
export class BookingService {
  constructor(
    @Inject(BOOKING_SCHEDULE_PROVIDER)
    private readonly bookingModel: Model<BookingModel>,
    @Inject(forwardRef(() => ScheduleService))
    private readonly scheduleService: ScheduleService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly agendaService: AgendaService,
    private readonly mailService: MailerService,
    private readonly queueEventService: QueueEventService
  ) {
    this.agendaService.define(
      EMAIL_REMINDER_FOR_BOOKING,
      {},
      this.handleEmailForBookingReminder.bind(this)
    );
    this.agendaService.every('5 minutes', EMAIL_REMINDER_FOR_BOOKING, {});
  }

  public async findById(id: string | ObjectId) {
    const data = await this.bookingModel.findById(id);
    return data;
  }

  public async findByIds(ids: string[] | ObjectId[]) {
    const data = await this.bookingModel.find({ _id: { $in: ids } });
    return data;
  }

  private async populateBookingData(data: LeanDocument<BookingModel>[]) {
    const scheduleIds = uniq(data.map((s) => s.scheduleId) || []);
    const userIds = uniq(data.map((p) => p.fromSourceId));
    const performerIds = uniq(data.map((s) => s.targetId) || []);
    const [schedules, performers, users] = await Promise.all([
      scheduleIds.length
        ? await this.scheduleService.findByIds(scheduleIds)
        : [],
      performerIds.length ? await this.userService.findByIds(performerIds) : [],
      userIds.length ? await this.userService.findByIds(userIds) : []
    ]);
    return data.map((f) => {
      const booking = new BookingDto(f);
      booking.scheduleInfo = f.scheduleId && schedules.length
        ? schedules.find((s) => s._id.equals(f.scheduleId))
        : null;
      booking.targetInfo = f.targetId && performers.length
        ? performers.find((p) => p._id.equals(f.targetId))
        : null;
      booking.sourceInfo = f.fromSourceId && users.length
        ? new UserDto(
          users.find((u) => u._id.equals(f.fromSourceId))
        ).toResponse()
        : null;
      return booking;
    });
  }

  public async create(
    payload: BookingCreatePayload,
    user: UserDto
  ): Promise<BookingDto> {
    const schedule = await this.scheduleService.findById(payload.scheduleId);
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    if (
      payload.startAt
      && !moment(payload.startAt).isBetween(
        schedule.startAt,
        schedule.endAt,
        null,
        '[]'
      )
    ) {
      throw new HttpException(
        'Start time must be in schedule time',
        HttpStatus.BAD_REQUEST
      );
    }

    const booking = await this.bookingModel.create({
      ...payload,
      fromSourceId: user._id,
      targetId: schedule.userId
    });
    const dto = new BookingDto(booking);

    await this.queueEventService.publish({
      channel: BOOKING_CHANNEL,
      eventName: EVENT.CREATED,
      data: { ...dto, sourceInfo: user }
    });
    return dto;
  }

  public async getByDateRanges(
    req: BookingSearchRequest
  ): Promise<PageableData<BookingDto>> {
    const query: FilterQuery<BookingModel> = {};
    if (req.status) {
      query.status = req.status;
    }

    if (req.startAt && req.endAt) {
      query.startAt = {
        $gt: moment(req.startAt)
          .startOf('date')
          .toDate()
      };
      query.endAt = {
        $lt: moment(req.endAt)
          .endOf('date')
          .toDate()
      };
    }

    if (isObjectId(req.targetId)) query.targetId = req.targetId;
    if (isObjectId(req.fromSourceId)) query.fromSourceId = req.fromSourceId;

    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || 'desc'
    };

    const [data, total] = await Promise.all([
      this.bookingModel
        .find(query)
        .limit(parseInt(req.limit as string, 10))
        .skip(parseInt(req.offset as string, 10))
        .sort(sort)
        .lean(),
      this.bookingModel.countDocuments(query)
    ]);

    return {
      data: await this.populateBookingData(data),
      total
    };
  }

  public async userGetDetail(
    id: string,
    currentUser: UserDto
  ): Promise<BookingDto> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (!booking.fromSourceId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    const [schedule, target] = await Promise.all([
      this.scheduleService.findById(booking.scheduleId),
      this.userService.findById(booking.targetId)
    ]);

    const data = new BookingDto(booking);
    data.targetInfo = new PerformerDto(target).toResponse();
    data.scheduleInfo = schedule
      ? plainToClass(PerformerScheduleDto, schedule.toObject())
      : {};
    return data;
  }

  public async performerGetDetail(
    id: string,
    currentUser: UserDto
  ): Promise<BookingDto> {
    const booking = await this.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (!booking.targetId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    const [schedule, fromSource] = await Promise.all([
      this.scheduleService.findById(booking.scheduleId),
      this.userService.findById(booking.fromSourceId)
    ]);

    const data = new BookingDto(booking);
    data.sourceInfo = new UserDto(fromSource).toResponse();
    data.scheduleInfo = schedule
      ? plainToClass(PerformerScheduleDto, schedule.toObject())
      : {};

    await this.bookingModel.updateOne(
      { _id: id, status: BOOKING_STATUS.CREATED },
      { $set: { status: BOOKING_STATUS.PENDING } }
    );
    return data;
  }

  public async update(
    id: string | ObjectId,
    payload: BookingUpdatePayload,
    currentUser: UserDto
  ): Promise<BookingDto> {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (!booking.fromSourceId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    const schedule = await this.scheduleService.findById(booking.scheduleId);
    if (!schedule) {
      throw new EntityNotFoundException();
    }

    if (
      payload.startAt
      && !moment(payload.startAt).isBetween(
        schedule.startAt,
        schedule.endAt,
        null,
        '[]'
      )
    ) {
      throw new HttpException(
        'Start time must be in schedule time',
        HttpStatus.BAD_REQUEST
      );
    }

    merge(booking, payload);
    await booking.save();
    const dto = new BookingDto(booking);
    return dto;
  }

  public async delete(id: string, currentUser: UserDto) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (
      !booking.fromSourceId.equals(currentUser._id)
      && !booking.targetId.equals(currentUser._id)
    ) {
      throw new ForbiddenException();
    }

    await booking.remove();
    return { success: true };
  }

  public async accept(id: string | ObjectId, currentUser: UserDto) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (!booking.targetId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    booking.status = BOOKING_STATUS.ACCEPTED;
    await booking.save();
    await this.queueEventService.publish({
      channel: BOOKING_CHANNEL,
      eventName: EVENT.UPDATED,
      data: new BookingDto(booking)
    });
    return true;
  }

  public async reject(id: string | ObjectId, currentUser: UserDto) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (!booking.targetId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    booking.status = BOOKING_STATUS.REJECT;
    await booking.save();
    await this.queueEventService.publish({
      channel: BOOKING_CHANNEL,
      eventName: EVENT.UPDATED,
      data: new BookingDto(booking)
    });
    return true;
  }

  public async updateStatus(
    id: string | ObjectId,
    currentUser: UserDto,
    status: BookingStatusType
  ) {
    const booking = await this.bookingModel.findById(id);
    if (!booking) {
      throw new EntityNotFoundException();
    }

    if (!booking.targetId.equals(currentUser._id)) {
      throw new ForbiddenException();
    }

    booking.status = status;
    await booking.save();
    await this.queueEventService.publish({
      channel: BOOKING_CHANNEL,
      eventName: EVENT.UPDATED,
      data: new BookingDto(booking)
    });
    return true;
  }

  dismissAllBooking(currentUser: UserDto) {
    return this.bookingModel.updateMany(
      { targetId: toObjectId(currentUser._id), status: BOOKING_STATUS.CREATED },
      { $set: { status: BOOKING_STATUS.PENDING } }
    );
  }

  private async handleEmailForBookingReminder() {
    const bookings = await this.bookingModel.find({
      status: BOOKING_STATUS.ACCEPTED,
      $and: [
        {
          startAt: {
            $gte: moment()
              .subtract(1, 'hour')
              .subtract(5, 'minute')
              .toDate()
          }
        },
        {
          startAt: {
            $lte: moment()
              .subtract(1, 'hour')
              .toDate()
          }
        }
      ]
    });
    if (bookings.length) {
      const targetIds = uniq(bookings.map((t) => t.targetId));
      const targetInfos = await this.userService.findByIds(targetIds);
      // eslint-disable-next-line no-restricted-syntax
      for (const booking of bookings) {
        const user = booking.targetId
          && targetInfos.find((t) => t._id.equals(booking.targetId));
        if (user) {
          // eslint-disable-next-line no-await-in-loop
          await this.mailService.send({
            to: user.username,
            subject: 'Booking Reminder',
            template: 'performer-booking-notification',
            data: {
              username: user.username,
              startAt: booking.startAt,
              duration: booking.duration,
              messege: booking.message
            }
          });
        }
      }
    }
  }
}
