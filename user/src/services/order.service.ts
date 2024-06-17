import { APIRequest } from './api-request';

export class OrderService extends APIRequest {
  search(payload) {
    return this.get(this.buildUrl('/orders/performers/search', payload));
  }

  detailsSearch(payload) {
    return this.get(this.buildUrl('/orders/performers/details/search', payload));
  }

  findById(id) {
    return this.get(`/orders/details/${id}`);
  }

  update(id, data) {
    return this.put(`/orders/${id}/update`, data);
  }

  getDownloadLinkDigital(productId: string) {
    return this.get(`/user/assets/products/${productId}/download-link`);
  }
}

export const orderService = new OrderService();
