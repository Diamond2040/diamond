import { APIRequest } from './api-request';

class ReviewService extends APIRequest {
  search(data) {
    return this.get(this.buildUrl('/reviews', data));
  }

  performerSearch(data) {
    return this.get(this.buildUrl('/performer/reviews', data));
  }

  create(data) {
    return this.post('/reviews', data);
  }
}

export const reviewService = new ReviewService();
