import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { EntityNotFoundException, PageableData } from 'src/kernel';
import { UserService } from 'src/modules/user/services';
import { ObjectId } from 'mongodb';
import { MailerService } from 'src/modules/mailer';
import { SettingService } from 'src/modules/settings';
import { SETTING_KEYS } from 'src/modules/settings/constants';
import { AbuseReportModel } from '../models';
import {
  PerformerAbuseReportPayload,
  PerformerAbuseReportSearchPayload
} from '../payloads';
import { ABUSE_REPORT_MODEL } from '../providers';
import { AbuseReportDto, AbuseReportResponse } from '../dtos';
import { ABUSE_REPORT_TYPES } from '../constant';

@Injectable()
export class PerformerAbuseReportService {
  constructor(
    @Inject(ABUSE_REPORT_MODEL)
    private readonly abuseReportModel: Model<AbuseReportModel>,
    private readonly userService: UserService,
    private readonly mailService: MailerService,
    private readonly settingService: SettingService
  ) {}

  public async create(
    payload: PerformerAbuseReportPayload,
    user
  ): Promise<AbuseReportResponse> {
    const {
      targetId,
      comment,
      category
    } = payload;
    const [source] = await Promise.all([
      this.userService.findById(targetId)
      // this.conversationService.findById(targetId)
    ]);
    if (!source) {
      throw new EntityNotFoundException();
    }

    // eslint-disable-next-line new-cap
    const abuseReport = new this.abuseReportModel();
    abuseReport.set('sourceId', user._id);
    abuseReport.set('targetId', targetId);
    abuseReport.set('type', ABUSE_REPORT_TYPES.MODEL);
    if (comment) {
      abuseReport.set('comment', comment);
    }
    if (category) {
      abuseReport.set('category', category);
    }
    await abuseReport.save();
    const dto = new AbuseReportDto(abuseReport).toResponse();
    const adminEmail = await this.settingService.getKeyValue(SETTING_KEYS.ADMIN_EMAIL);
    if (adminEmail) {
      await this.mailService.send({
        subject: 'Abuse Report',
        to: adminEmail,
        data: {
          sender: source.username || source.email
        },
        template: 'abuse-report'
      });
    }

    return dto;
  }

  public async getAbuseReportById(
    id: string | ObjectId
  ): Promise<AbuseReportResponse> {
    const abuseReport = await this.abuseReportModel.findById(id);
    if (!abuseReport) {
      throw new EntityNotFoundException();
    }

    if (abuseReport.type !== ABUSE_REPORT_TYPES.MODEL) {
      throw new BadRequestException();
    }

    const dto = new AbuseReportDto(abuseReport);
    const [sourceInfo, targetInfo] = await Promise.all([
      this.userService.findById(abuseReport.sourceId),
      this.userService.findById(abuseReport.targetId)
    ]);

    if (sourceInfo) {
      dto.sourceInfo = {
        email: sourceInfo.email,
        username: sourceInfo.username
      };
    }
    if (targetInfo) {
      dto.targetInfo = {
        name: targetInfo.name
      };
    }
    return dto.toResponse();
  }

  public async delete(id: string | ObjectId) {
    const abuseReport = await this.abuseReportModel.findById(id);
    if (!abuseReport) {
      throw new EntityNotFoundException();
    }

    if (abuseReport.type !== ABUSE_REPORT_TYPES.MODEL) {
      throw new BadRequestException();
    }

    return this.abuseReportModel.deleteOne({ _id: id });
  }

  public async search(
    req: PerformerAbuseReportSearchPayload
  ): Promise<PageableData<AbuseReportResponse>> {
    const { limit, offset } = req;
    const query: FilterQuery<AbuseReportModel> = {
      type: ABUSE_REPORT_TYPES.MODEL
    };
    const sort = {
      [req.sortBy || 'updatedAt']: req.sort || 'desc'
    };
    const [data, total] = await Promise.all([
      this.abuseReportModel
        .find(query)
        .limit(parseInt(limit as string, 10))
        .skip(parseInt(offset as string, 10))
        .sort(sort)
        .lean(),
      this.abuseReportModel.count(query)
    ]);

    const sourceIds = data.map((d) => d.sourceId);
    const targetIds = data.map((d) => d.targetId);
    const [sources, targets] = await Promise.all([
      this.userService.findByIds(sourceIds),
      this.userService.findByIds(targetIds)
    ]);

    const abuseReposts = data.map((d) => new AbuseReportDto(d));
    abuseReposts.forEach((abuseReport) => {
      if (abuseReport.sourceId) {
        const sourceInfo = sources.find(
          (source) => source._id.equals(abuseReport.sourceId)
        );
        // eslint-disable-next-line no-param-reassign
        if (sourceInfo) abuseReport.sourceInfo = sourceInfo.toResponse();
      }
      if (abuseReport.targetId) {
        const targetInfo = targets.find(
          (target) => target._id.equals(abuseReport.targetId)
        );
        // eslint-disable-next-line no-param-reassign
        if (targetInfo) abuseReport.targetInfo = targetInfo;
      }
    });

    return {
      data: abuseReposts.map((abuseRepost) => abuseRepost.toResponse()),
      total
    };
  }
}
