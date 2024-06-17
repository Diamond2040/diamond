import { APIRequest } from './api-request';

export class PaymentService extends APIRequest {
  getListTransactions(payload) {
    return this.get(this.buildUrl('/payment/transactions', payload));
  }

  userSearchTransactions(payload) {
    return this.get(this.buildUrl('/transactions/user/search', payload));
  }

  subscribe(payload) {
    return this.post('/payment/subscribe-performer', payload);
  }

  cancelSubscription(id: string) {
    return this.post(`/subscriptions/cancel/${id}`);
  }
}

export const paymentService = new PaymentService();
