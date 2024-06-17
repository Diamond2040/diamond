import { PureComponent, createRef } from 'react';
import {
  Form, Button, Select, DatePicker, message
} from 'antd';
import { ISubscriptionCreate } from 'src/interfaces';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import { performerService } from '@services/performer.service';

const { Option } = Select;
interface IProps {
  onFinish: Function;
  submiting?: boolean;
}
function disabledDate(current) {
  return current && current < moment().endOf('day');
}
export class FormSubscription extends PureComponent<IProps> {
  formRef: any;

  timeout = 0;

  state = {
    users: [],
    searching: false
  };

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
  }

  handleSearch = async (value: string) => {
    try {
      if (this.timeout) clearTimeout(this.timeout);
      await this.setState({ searching: true });
      this.timeout = window.setTimeout(async () => {
        const result = await performerService.search({
          q: value,
          limit: 999
        });
        this.setState({ users: result.data.data });
      }, 300);
    } catch (error) {
      message.error('An error occurred, please try again!');
    } finally {
      this.setState({ searching: false });
    }
  };

  render() {
    if (!this.formRef) this.formRef = createRef();
    const { onFinish, submiting } = this.props;
    const { users, searching } = this.state;

    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          {
            subscriptionType: 'system',
            userId: '',
            status: 'active',
            expiredAt: '',
            membershipType: 'basic'
          } as ISubscriptionCreate
        }
        layout="vertical"
      >
        <Form.Item name="subscriptionType" label="Type" rules={[{ required: true, message: 'Please select type!' }]}>
          <Select>
            {/* <Select.Option key="single" value="single">
              Non-recurring
            </Select.Option> */}
            {/* <Select.Option key="recurring" value="recurring" disabled>
              Recurring
            </Select.Option> */}
            <Select.Option key="system" value="system" disabled>
              System
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="userId" label="Performer" rules={[{ required: true, message: 'Please select user' }]}>
          <Select
            showSearch
            defaultActiveFirstOption={false}
            showArrow
            filterOption={false}
            onSearch={this.handleSearch}
            onChange={(val) => this.setFormVal('userId', val)}
            notFoundContent={null}
            allowClear
            loading={searching}
          >
            {users.map((u) => (
              <Option key={u._id} value={u._id}>
                <span>
                  <strong>{u.name || u.username || `${u.firstName} ${u.lastName}`}</strong>
                </span>
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="membershipType" label="Membership type" rules={[{ required: true, message: 'Please select status!' }]}>
          <Select>
            <Select.Option key="basic" value="basic">
              Basic
            </Select.Option>
            <Select.Option key="premium" value="premium">
              Premium
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive" disabled>
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="expiredAt"
          label="Expiry Date"
          rules={[{ required: true, message: 'Please input select expiry date of subscription!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item wrapperCol={{ span: 20, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
