import { IUser } from 'src/interfaces';
import { getGlobalConfig } from './config';
import { APIRequest, IResponse } from './api-request';

export class UserService extends APIRequest {
  me(headers?: { [key: string]: string }): Promise<IResponse<IUser>> {
    return this.get('/users/me', headers);
  }

  updateMe(payload: any) {
    return this.put('/users', payload);
  }

  getAvatarUploadUrl(userId?: string) {
    const config = getGlobalConfig();
    if (userId) {
      return `${config.NEXT_PUBLIC_API_ENDPOINT}/users/${userId}/avatar/upload`;
    }
    return `${config.NEXT_PUBLIC_API_ENDPOINT}/users/avatar/upload`;
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/users/search', query));
  }

  findById(id: string) {
    return this.get(`/users/view/${id}`);
  }

  checkCountryBlock() {
    return this.get('/country-block/check');
  }
}

export const userService = new UserService();
