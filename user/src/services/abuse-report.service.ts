import { APIRequest } from './api-request';

class ReportService extends APIRequest {
  reportModel(data) {
    return this.post('/abuse-report/performers', data);
  }
}

export const reportService = new ReportService();
