import { Inject, Injectable } from '@nestjs/common';
import { merge } from 'lodash';
import { Model, ObjectId } from 'mongoose';
import { EntityNotFoundException, PageableData } from 'src/kernel';
import { CustomAttributeModel } from '../models';
import { CustomAttributePayload, CustomAttributeSearchRequest } from '../payloads/custom-attribute.payload';
import { CUSTOM_ATTRIBUTE_DB_PROVIDER } from '../providers/custom-attribute.provider';

@Injectable()
export class CustomAttributeService {
  constructor(
    @Inject(CUSTOM_ATTRIBUTE_DB_PROVIDER)
    private readonly CustomAttribute: Model<CustomAttributeModel>
  ) {}

  async findByKey(key: string, group: string) {
    return this.CustomAttribute.findOne({ key, group });
  }

  async findById(id: string) {
    return this.CustomAttribute.findOne({ _id: id });
  }

  async create(data: CustomAttributePayload): Promise<CustomAttributeModel> {
    let attr = await this.CustomAttribute.findOne({
      key: data.key,
      group: data.group
    });
    if (!attr) {
      attr = new this.CustomAttribute();
    }

    merge(attr, data);
    return attr.save();
  }

  async update(
    id: string | ObjectId,
    data: CustomAttributePayload
  ): Promise<CustomAttributeModel> {
    const attr = await this.CustomAttribute.findOne({ _id: id });
    if (!attr) {
      throw new EntityNotFoundException();
    }

    merge(attr, data);
    return attr.save();
  }

  async delete(id: string | ObjectId) {
    const attr = await this.CustomAttribute.findOne({ _id: id });
    if (!attr) {
      throw new EntityNotFoundException();
    }

    return attr.delete();
  }

  async search(
    req: CustomAttributeSearchRequest
  ): Promise<PageableData<any>> {
    const query = {} as any;
    if (req.key) {
      query.key = req.key;
    }

    if (req.group) {
      query.group = req.group;
    }

    const [data, total] = await Promise.all([
      this.CustomAttribute.find(query),
      this.CustomAttribute.countDocuments(query)
    ]);

    return {
      data,
      total
    };
  }

  async findAllByGroup(groupId: string) {
    return this.CustomAttribute.find({
      group: groupId
    });
  }

  async findAll() {
    return this.CustomAttribute.find();
  }

  async findAllGroup() {
    return this.CustomAttribute.distinct('group');
  }
}
