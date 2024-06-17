import { APIRequest } from './api-request';

class AbuseReportService extends APIRequest {
  detail(id: string) {
    return this.get(`/abuse-report/performers/${id}/view`);
  }

  search(query?: { [key: string]: any }) {
    return this.get('/abuse-report/performers', query);
  }

  delete(id: string) {
    return this.del(`/abuse-report/performers/${id}`);
  }
}

export const abuseReportService = new AbuseReportService();
