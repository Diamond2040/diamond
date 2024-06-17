import { Injectable, Inject } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { PageableData } from 'src/kernel/common';
import * as moment from 'moment';
import { COUNTRIES } from 'src/modules/utils/constants';
import { PerformerModel } from '../models';
import { PERFORMER_MODEL_PROVIDER } from '../providers';
import { PerformerDto, IPerformerResponse } from '../dtos';
import { PerformerSearchPayload } from '../payloads';
import { PERFORMER_STATUSES } from '../constants';

@Injectable()
export class PerformerSearchService {
  constructor(
    @Inject(PERFORMER_MODEL_PROVIDER)
    private readonly performerModel: Model<PerformerModel>
  ) {}

  public async adminSearch(
    req: PerformerSearchPayload
  ): Promise<PageableData<IPerformerResponse>> {
    const query = {} as any;
    if (req.q) {
      const searchValue = {
        $regex: new RegExp(
          req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
          'i'
        )
      };
      query.$or = [
        { firstName: searchValue },
        { lastName: searchValue },
        { name: searchValue },
        { username: searchValue },
        { email: searchValue },
        { bio: searchValue }
      ];
    }
    if (req.categoryId) {
      query.categoryIds = { $in: [req.categoryId] };
    }
    if (req.categoryIds && req.categoryIds.length) {
      query.categoryIds = Array.isArray(req.categoryIds)
        ? { $in: req.categoryIds }
        : { $in: [req.categoryIds] };
    }
    [
      'hair',
      'pubicHair',
      'ethnicity',
      'bodyType',
      'gender',
      'status',
      'height',
      'weight',
      'eyes',
      'butt',
      'sexualOrientation'
    ].forEach((f) => {
      if (req[f]) {
        query[f] = req[f];
      }
    });
    if (req.country) {
      const country = COUNTRIES.find(
        (c) => c.code === req.country || c.name === req.country
      );
      if (country) {
        query.country = {
          $in: [country.code, country.name]
        };
      }
    }
    if (req.fromAge && req.toAge) {
      query.dateOfBirth = {
        $gte: new Date(req.fromAge),
        $lte: new Date(req.toAge)
      };
    }
    if (req.age) {
      const fromAge = req.age.split('_')[0];
      const toAge = req.age.split('_')[1];
      const fromDate = moment()
        .subtract(toAge, 'years')
        .startOf('day')
        .toDate();
      const toDate = moment()
        .subtract(fromAge, 'years')
        .startOf('day')
        .toDate();
      query.dateOfBirth = {
        $gte: fromDate,
        $lte: toDate
      };
    }
    let sort = {
      isOnline: -1
    } as any;
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    if (req.sort === 'latest') {
      sort = '-createdAt';
    }
    if (req.sort === 'oldest') {
      sort = 'createdAt';
    }
    if (req.sort === 'popular') {
      sort = '-stats.views';
    }
    const [data, total] = await Promise.all([
      this.performerModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.performerModel.countDocuments(query)
    ]);
    return {
      data: data.map((d) => new PerformerDto(d).toResponse(true)),
      total
    };
  }

  // TODO - should create new search service?
  public async search(req: PerformerSearchPayload): Promise<PageableData<any>> {
    const query = {
      status: PERFORMER_STATUSES.ACTIVE
      // membershipType: {
      //   $ne: null
      // }
    } as any;
    if (req.q) {
      const searchValue = {
        $regex: new RegExp(
          req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
          'i'
        )
      };
      query.$or = [{ username: searchValue }, { aboutMe: searchValue }];
    }
    if (req.categoryId) {
      query.categoryIds = { $in: [req.categoryId] };
    }
    if (req.categoryIds && req.categoryIds.length) {
      query.categoryIds = Array.isArray(req.categoryIds)
        ? { $in: req.categoryIds }
        : { $in: [req.categoryIds] };
    }
    [
      'hair',
      'pubicHair',
      'ethnicity',
      'gender',
      'status',
      'hairColor',
      'height',
      'weight',
      'eyes',
      'orientation'
    ].forEach((f) => {
      if (req[f]) {
        query[f] = req[f];
      }
    });

    if (req.service) {
      query.services = {
        $in: [req.service]
      };
    }

    if (req.country) {
      const country = COUNTRIES.find(
        (c) => c.code === req.country || c.name === req.country
      );
      if (country) {
        query.country = {
          $in: [country.code, country.name]
        };
      }
    }

    if (req.vip) {
      query.vip = true;
    }

    ['languages', 'meetingWith'].forEach((f) => {
      if (req[f]) {
        query[f] = {
          $in: [req[f]]
        };
      }
    });
    if (req.fromAge && req.toAge) {
      query.dateOfBirth = {
        $gte: moment(req.fromAge)
          .startOf('day')
          .toDate(),
        $lte: moment(req.toAge)
          .endOf('day')
          .toDate()
      };
    }
    if (req.age) {
      const split = req.age.split('_');
      const from = parseInt(split[0], 10);
      const to = split.length === 2 ? parseInt(split[1], 10) : parseInt(split[0], 10);
      const fromDate = moment()
        .subtract(to, 'years')
        .startOf('year')
        .toDate();
      const toDate = moment()
        .subtract(from, 'years')
        .endOf('year')
        .toDate();
      query.dateOfBirth = {
        $lte: toDate,
        $gte: fromDate
      };
    }
    if (req.city) {
      query.city = {
        $regex: new RegExp(
          req.city.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
          'i'
        )
      };
    }
    let sort = {
      createdAt: -1
    } as any;
    if (req.sort && req.sortBy) {
      sort = {
        [req.sortBy]: req.sort
      };
    }
    if (req.sort === 'latest') {
      sort = '-createdAt';
    }
    if (req.sort === 'oldest') {
      sort = 'createdAt';
    }
    if (req.sort === 'popular') {
      sort = '-score';
    }
    if (req.sort === 'lastOnline') {
      sort = {
        isOnline: -1,
        onlineAt: -1
      };
    }

    const [data, total] = await Promise.all([
      this.performerModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.performerModel.countDocuments(query)
    ]);
    return {
      data: data.map((d) => new PerformerDto(d).toPublicDetailsResponse()),
      total
    };
  }

  public async searchByKeyword(req: PerformerSearchPayload): Promise<any> {
    const query = {} as any;
    if (req.q) {
      const searchValue = {
        $regex: new RegExp(
          req.q.toLowerCase().replace(/[^a-zA-Z0-9]/g, ''),
          'i'
        )
      };
      query.$or = [
        {
          name: searchValue
        },
        {
          username: searchValue
        }
      ];
    }
    const [data] = await Promise.all([this.performerModel.find(query).lean()]);
    return data;
  }

  public async topPerformers(
    req: PerformerSearchPayload
  ): Promise<PageableData<IPerformerResponse>> {
    const query = {} as any;
    query.status = 'active';
    query.membershipType = {
      $ne: null
    };
    if (req.gender) {
      query.gender = req.gender;
    }
    const sort = {
      score: -1,
      'stats.subscribers': -1,
      'stats.views': -1
    };
    const [data, total] = await Promise.all([
      this.performerModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.performerModel.countDocuments(query)
    ]);
    return {
      data: data.map((item) => new PerformerDto(item).toSearchResponse()),
      total
    };
  }

  public async searchSplotLight(req: PerformerSearchPayload) {
    const query: FilterQuery<PerformerModel> = {
      createdAt: {
        $gt: moment()
          .subtract(30, 'days')
          .startOf('day')
          .toDate()
      }
    };
    const sort = '-createdAt';
    let total = await this.performerModel.countDocuments(query);
    let data = [];
    if (total <= 10) {
      [data, total] = await Promise.all([this.performerModel
        .find()
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10)),
      this.performerModel.countDocuments()
      ]);
    } else {
      data = await this.performerModel
        .find(query)
        .lean()
        .sort(sort)
        .limit(req.limit ? parseInt(req.limit as string, 10) : 10)
        .skip(parseInt(req.offset as string, 10));
    }

    return {
      data: data.map((item) => new PerformerDto(item).toSearchResponse()),
      total
    };
  }
}
