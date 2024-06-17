import { APIRequest } from './api-request';

export class PerformerService extends APIRequest {
  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/search', query));
  }

  searchSpotlight(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/performers/search/spotlight', query));
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/performers/${encodeURI(id)}`, headers);
  }

  related(id: string) {
    return this.get(`/performers/${encodeURI(id)}/related`);
  }

  updateProfile(payload: any) {
    return this.put('/performers', payload);
  }

  me() {
    return this.get('/performers/me');
  }

  allProfileImages(performerId = null) {
    const uri = performerId
      ? `/performers/${performerId}/profile-images/all`
      : '/performers/me/profile-images/all';
    return this.get(uri);
  }

  imageUpload(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/performers/me/profile-images',
      [
        {
          fieldname: 'file',
          file
        }
      ],
      {
        onProgress: onProgress || function oP() {},
        customData: payload
      }
    );
  }

  deleteProfileImage(id: string) {
    return this.del(`/performers/me/profile-images/${id}`);
  }

  setAvatar(profileImageId: string) {
    return this.put(`/performers/me/profile-images/${profileImageId}/main`);
  }

  categoriesList(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/user/categories/search', query));
  }

  mapWithAttributes(performer, attributes = {} as any) {
    if (!performer) return null;
    const data = { ...performer } as any;
    const mapData = (field, attrName) => {
      if (!data[field] || !attributes[attrName]?.length) return;

      if (!Array.isArray(data[field])) {
        const attr = attributes[attrName].find(
          (a) => a.key === performer[field]
        );
        data[field] = attr ? attr.value : 'N/A';
      } else {
        data[field] = attributes[attrName]
          .filter((a) => performer[field].includes(a.key))
          .map((attr) => attr.value);
      }
    };
    mapData('bustType', 'bustTypes');
    mapData('bustSize', 'bustSizes');
    mapData('travels', 'travels');
    mapData('ethnicity', 'ethnicities');
    mapData('orientation', 'orientations');
    mapData('provide', 'provides');
    mapData('meetingWith', 'meetingWith');
    mapData('height', 'heights');
    mapData('weight', 'weights');
    mapData('service', 'services');
    mapData('eyes', 'eyes');
    mapData('hairColor', 'hairColor');
    mapData('hairLength', 'hairLengths');
    mapData('smoker', 'smoker');
    mapData('tattoo', 'tattoo');
    mapData('gender', 'genders');
    mapData('currencies', 'currencies');
    return data;
  }

  mySettings() {
    return this.get('/performer-services');
  }

  updateSettings(group, settings) {
    return this.put('/performer-services', {
      group, settings
    });
  }

  loadSettings(performerId) {
    return this.get(`/performer-services/performers/${performerId}`);
  }

  relatedPerformers(username: string) {
    return this.get(`/performers/${username}/related`);
  }

  contact(username, data) {
    return this.post(`/performers/${username}/contact`, data);
  }
}

export const performerService = new PerformerService();
