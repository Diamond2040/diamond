import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { EntityNotFoundException } from 'src/kernel';
import { ObjectId } from 'mongodb';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER, PERFORMER_SERVICE_SETTING_MODEL_PROVIDER } from '../providers';
import { ServiceSettingModel } from '../models/service-setting.model';
import { ServiceSettingPayload } from '../payloads/service-setting-update.payload';

@Injectable()
export class PerformerServiceSettingService {
  constructor(
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly Performer: Model<PerformerModel>,

    @Inject(PERFORMER_SERVICE_SETTING_MODEL_PROVIDER)
    private readonly ServiceSetting: Model<ServiceSettingModel>
  ) {}

  public async findByPerformerId(
    performerId: string | ObjectId,
    group: string
  ): Promise<any> {
    return this.ServiceSetting.findOne({ performerId, group });
  }

  public async update(
    performerId: string | ObjectId,
    payload: ServiceSettingPayload
  ): Promise<any> {
    const performer = await this.Performer.findById(performerId);
    if (!performer) {
      throw new EntityNotFoundException();
    }

    let setting = await this.ServiceSetting.findOne({
      performerId,
      group: payload.group
    });
    if (!setting) {
      setting = new this.ServiceSetting({
        performerId,
        group: payload.group
      });
    }
    setting.settings = payload.settings;
    return setting.save();
  }

  public async getListSettings(performerId: string | ObjectId): Promise<any> {
    return this.ServiceSetting.find({
      performerId
    });
  }

  public async getSettingsByGroup(performerId: string | ObjectId, group: string): Promise<any> {
    return this.ServiceSetting.findOne({
      performerId,
      group
    });
  }
}
