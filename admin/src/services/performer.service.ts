import { getGlobalConfig } from './config';
import { APIRequest } from './api-request';

export class PerformerService extends APIRequest {
  create(payload: any) {
    return this.post('/admin/performers', payload);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/performers/${id}`, payload);
  }

  search(query?: { [key: string]: any }) {
    return this.get(this.buildUrl('/admin/performers/search', query));
  }

  findById(id: string) {
    return this.get(`/admin/performers/${id}/view`);
  }

  findByUserId(id: string) {
    return this.get(`/admin/performers/by-users/${id}`);
  }

  getUploadDocumentUrl() {
    const config = getGlobalConfig();
    return `${config.NEXT_PUBLIC_API_ENDPOINT}/admin/performers/documents/upload`;
  }

  getAvatarUploadUrl() {
    const config = getGlobalConfig();
    return `${config.NEXT_PUBLIC_API_ENDPOINT}/admin/performers/avatar/upload`;
  }

  getCoverUploadUrl() {
    const config = getGlobalConfig();
    return `${config.NEXT_PUBLIC_API_ENDPOINT}/admin/performers/cover/upload`;
  }

  updatePaymentGatewaySetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/payment-gateway-settings`, payload);
  }

  updateCommissionSetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/commission-settings`, payload);
  }

  updateBankingSetting(id: string, payload: any) {
    return this.put(`/admin/performers/${id}/banking-settings`, payload);
  }

  allProfileImages(performerId) {
    return this.get(`/admin/performer-profile-images/performers/${performerId}/all`);
  }

  imageUpload(file: File, payload: any, onProgress?: Function) {
    return this.upload(
      '/admin/performer-profile-images',
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
    return this.del(`/admin/performer-profile-images/${id}`);
  }

  setAvatar(performerId: string, profileImageId: string) {
    return this.put(`/admin/performer-profile-images/${profileImageId}/main`, {
      performerId
    });
  }

  updateSettings(performerId, group, settings) {
    return this.put(`/admin/performer-services/performers/${performerId}`, {
      group,
      settings
    });
  }

  loadSettings(performerId) {
    return this.get(`/admin/performer-services/performers/${performerId}`);
  }
}

export const performerService = new PerformerService();
