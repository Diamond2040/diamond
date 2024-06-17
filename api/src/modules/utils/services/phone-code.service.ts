import { Injectable } from '@nestjs/common';
import { PHONE_CODE } from '../constants';

@Injectable()
export class PhoneCodeService {
  private phoneCodeList;

  public getList() {
    if (this.phoneCodeList) {
      return this.phoneCodeList;
    }

    this.phoneCodeList = PHONE_CODE.map((c) => ({
      name: c.name,
      code: c.dialCode,
      countryCode: c.code
    }));
    return this.phoneCodeList;
  }
}
