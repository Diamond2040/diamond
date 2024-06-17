import { ICountry, ILangguges, IPhoneCodes } from 'src/interfaces';
import { APIRequest, IResponse } from './api-request';

export class UtilsService extends APIRequest {
  phoneCodesList(): Promise<IResponse<IPhoneCodes>> {
    return this.get('/phone-codes/list');
  }

  servicesList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/services/all');
  }

  eyesColorList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/eyes/all');
  }

  hairColorList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/hairColor/all');
  }

  hairLengthList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/hairLength/all');
  }

  bustSizeList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/bustSize/all');
  }

  bustTypeList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/bustType/all');
  }

  travelList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/travel/all');
  }

  weightList(): Promise<IResponse<string>> {
    return this.get('/admin/attributes/groups/weight/all');
  }

  heightList(): Promise<IResponse<string>> {
    return this.get('/admin/attributes/groups/height/all');
  }

  ethnicityList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/ethnicity/all');
  }

  orientationList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/orientation/all');
  }

  providesList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/provides/all');
  }

  meetingWithList(): Promise<IResponse<ICountry>> {
    return this.get('/admin/attributes/groups/meetingWith/all');
  }

  allAttributes(): Promise<any> {
    return this.get('/admin/attributes/groups/all');
  }

  countriesList(): Promise<IResponse<ICountry>> {
    return this.get('/countries/list');
  }

  languagesList(): Promise<IResponse<ILangguges>> {
    return this.get('/languages/list');
  }

  statistics(): Promise<IResponse<any>> {
    return this.get('/statistics/admin');
  }
}

export const utilsService = new UtilsService();
