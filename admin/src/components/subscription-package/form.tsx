import { PureComponent, createRef } from 'react';
import {
  Form, Input, Button, InputNumber, Checkbox, Select
} from 'antd';
import { ISubscriptionPackageCreate, ISubscriptionPackage } from 'src/interfaces';
import { FormInstance } from 'antd/lib/form';

interface IProps {
  subscriptionPackage?: Partial<ISubscriptionPackage>;
  onFinish: Function;
  submiting?: boolean;
}

export class FormSubscriptionPackage extends PureComponent<IProps> {
  state = {
    isRecurring: true
  }

  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
    const { subscriptionPackage } = this.props;
    if (subscriptionPackage && subscriptionPackage.type === 'recurring') {
      this.setState({ isRecurring: true });
    }
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance.setFieldsValue({
      [field]: val
    });
    if (field === 'type') {
      this.setState({ isRecurring: val === 'recurring' });
    }
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      subscriptionPackage, onFinish, submiting
    } = this.props;
    const { isRecurring } = this.state;
    return (
      <Form
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          subscriptionPackage || ({
            name: '',
            price: 1,
            tokens: 1,
            isActive: true,
            ordering: 0,
            description: '',
            recurringPrice: 0,
            recurringPeriod: 0,
            type: 'recurring',
            membershipType: 'basic'
          } as ISubscriptionPackageCreate)
        }
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please input name!' }]}
          label="Name"
        >
          <Input placeholder="Enter package's name" />
        </Form.Item>

        <Form.Item
          name="initialPeriod"
          label="Initial Period"
          rules={[{ required: true, message: 'Please input day of period!' }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: 'Please input price!' }]}
          extra="Initial Price"
        >
          <InputNumber placeholder="Please input price of package" min={1} />
        </Form.Item>
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: 'Please select type!' }]}
        >
          <Select onChange={(val) => this.setFormVal('type', val)}>
            {/* <Select.Option key="single" value="single">
              Single
            </Select.Option> */}
            <Select.Option key="recurring" value="recurring">
              Recurring
            </Select.Option>
          </Select>
        </Form.Item>
        {isRecurring && (
          <div>
            <Form.Item
              name="recurringPrice"
              label="Recurring Price"
              rules={[{ required: true, message: 'Please input price!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
            <Form.Item
              name="recurringPeriod"
              label="Recurring Period"
              extra="Number of days to recurring"
              rules={[{ required: true, message: 'Field not empty!' }]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </div>
        )}
        <Form.Item
          name="membershipType"
          label="Membership Type"
          rules={[{ required: true, message: 'Please select type!' }]}
        >
          <Select onChange={(val) => this.setFormVal('membershipType', val)}>
            <Select.Option key="basic" value="basic">
              Basic
            </Select.Option>
            <Select.Option key="premium" value="premium">
              Premium
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="ordering" label="Ordering">
          <InputNumber />
        </Form.Item>
        <Form.Item name="isActive" valuePropName="checked" label="Active?">
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ float: 'right' }}
            loading={submiting}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
