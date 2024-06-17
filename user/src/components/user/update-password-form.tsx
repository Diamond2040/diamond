import React from 'react';
import {
  Form, Button, Input, Row, Col
} from 'antd';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

interface IProps {
  onFinish: Function;
  updating: boolean;
}

export const UpdatePaswordForm = ({ onFinish, updating = false }: IProps) => (
  <Form
    name="nest-messages"
    className="account-form"
    onFinish={onFinish.bind(this)}
    {...layout}
  >
    <Row>
      <Col lg={12} md={12} sm={24} xs={24}>
        <Form.Item
          label="Password"
          name="password"
          validateTrigger={['onChange', 'onBlur']}
          hasFeedback
          rules={[
            {
              pattern: new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g),
              message: 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
            },
            { required: true, message: 'Please enter your password!' }
          ]}
        >
          <Input.Password placeholder="Password" className="ctl-input-password" />
        </Form.Item>
      </Col>
      <Col lg={12} md={12} sm={24} xs={24}>
        <Form.Item
          name="confirm"
          label="Confirm Password"
          validateTrigger={['onChange', 'onBlur']}
          dependencies={['password']}
          hasFeedback
          rules={[
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                // eslint-disable-next-line prefer-promise-reject-errors
                return Promise.reject('Passwords do not match together!');
              }
            })
          ]}
        >
          <Input.Password placeholder="Confirm password" className="ctl-input-password" />
        </Form.Item>
      </Col>
      <Col lg={6} md={6} sm={24} xs={24}>
        <Form.Item>
          <Button className="btn-submit" htmlType="submit" loading={updating}>
            Save change
          </Button>
        </Form.Item>
      </Col>
    </Row>
  </Form>
);
