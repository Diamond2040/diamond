import { APIRequest } from './api-request';

export class ScheduleService extends APIRequest {
  performerGetSchedules(query?: Record<string, any>) {
    return this.get(this.buildUrl('/schedules', query));
  }

  userGetSchedules(query?: Record<string, any>) {
    return this.get(this.buildUrl('/schedules/search', query));
  }

  findOne(id: string, headers?: { [key: string]: string }) {
    return this.get(`/schedules/${id}/view`, headers);
  }

  createSchedule(data) {
    return this.post('/schedules', data);
  }

  updateSchedule(id:string, payload: any) {
    return this.put(`/schedules/${id}`, payload);
  }

  deleteSchedule(id: string) {
    return this.del(`/schedules/${id}`);
  }

  findEventByDate(date: any) {
    return this.get(`/schedules/${date}`);
  }

  bookSlot(data) {
    return this.post('/booking', data);
  }

  findBooking(query?: Record<string, any>) {
    return this.get(this.buildUrl('/booking', query));
  }

  listNotification() {
    return this.get('/booking/notification/search');
  }

  dismissAllNotification() {
    return this.post('/booking/notification/dismiss');
  }

  performerFindBooking(query?: Record<string, any>) {
    return this.get(this.buildUrl('/booking/performer/search', query));
  }

  findOneBooking(id: string) {
    return this.get(`/booking/${id}`);
  }

  performerFindOneBooking(id: string) {
    return this.get(`/booking/performer/${id}`);
  }

  deleteOneBooking(id: string) {
    return this.del(`/booking/${id}`);
  }

  dismiss(id: string) {
    return this.post(`/booking/performer/${id}/dismiss`);
  }

  dismissAll() {
    return this.post('/booking/performer/dismiss');
  }

  AcceptedBooking(id: string) {
    return this.post(`/booking/performer/${id}/approve`);
  }

  rejectBooking(id: string) {
    return this.post(`/booking/performer/${id}/reject`);
  }
}

export const scheduleService = new ScheduleService();
