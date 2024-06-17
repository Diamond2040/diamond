import { APIRequest } from './api-request';

export class FavoriteService extends APIRequest {
  create(data) {
    return this.post('/reactions', data);
  }

  search(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/reactions/performers/favourites', query)
    );
  }

  delete(data: any) {
    return this.del('/reactions', data);
  }
}

export const favoriteService = new FavoriteService();
