import { APIRequest } from './api-request';

class SubscriptionService extends APIRequest {
  searchPackage(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/package/subscription/search', query));
  }

  current() {
    return this.get('/subscriptions/performers/current');
  }

  cancelSubscription() {
    return this.post('/subscriptions/cancel');
  }
}
export const subscriptionService = new SubscriptionService();
