import { APIRequest } from './api-request';

export class AttributeService extends APIRequest {
  create(data) {
    return this.post('/admin/attributes', data);
  }

  list(query?: { [key: string]: any }) {
    return this.get(
      this.buildUrl('/admin/attributes', query)
    );
  }

  findById(id: string) {
    return this.get(`/admin/attributes/${id}`);
  }

  update(id: string, payload: any) {
    return this.put(`/admin/attributes/${id}`, payload);
  }

  delete(id: string) {
    return this.del(`/admin/attributes/${id}`);
  }

  getGroups() {
    return [
      {
        key: 'bustSize',
        text: 'Bust size'
      },
      {
        key: 'bustType',
        text: 'Bust type'
      },
      {
        key: 'ethnicity',
        text: 'Ethnicity'
      },
      {
        key: 'eyes',
        text: 'Eyes'
      },
      {
        key: 'hairColor',
        text: 'Hair color'
      },
      {
        key: 'hairLength',
        text: 'Hair lengths'
      },
      {
        key: 'height',
        text: 'Height'
      },
      {
        key: 'weight',
        text: 'Weight'
      },
      {
        key: 'meetingWith',
        text: 'Meeting with'
      },
      {
        key: 'orientation',
        text: 'Orientation'
      },
      {
        key: 'provides',
        text: 'Provides'
      },
      {
        key: 'service',
        text: 'Services'
      },
      {
        key: 'travel',
        text: 'Travel'
      },
      {
        key: 'gender',
        text: 'Gender'
      },
      {
        key: 'smoker',
        text: 'Smoker'
      },
      {
        key: 'tattoo',
        text: 'Tattoo'
      },
      {
        key: 'time',
        text: 'Time'
      },
      {
        key: 'currency',
        text: 'Currency'
      }
    ];
  }
}

export const attributeService = new AttributeService();
