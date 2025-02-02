import React from 'react';
import { Form, Button, Input } from 'antd';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  updating: boolean;
}

export const UpdatePaswordForm = ({ onFinish, updating = false }: IProps) => (
  <Form name="nest-messages" onFinish={onFinish.bind(this)} {...layout}>
    <Form.Item
      name="password"
      label="Password"
      validateTrigger={['onChange', 'onBlur']}
      hasFeedback
      rules={[
        { required: true, message: 'Please input your password!' },
        { min: 6, message: 'Password must contain at least 6 characters' }
      ]}
    >
      <Input.Password />
    </Form.Item>
    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
      <Button type="primary" htmlType="submit" loading={updating}>
        Update
      </Button>
    </Form.Item>
  </Form>
);
