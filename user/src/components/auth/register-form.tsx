import Link from 'next/link';
import { useState } from 'react';
import {
  Form, Input, Row, Col, Button, Checkbox, message
} from 'antd';

interface IProps {
  submit: Function;
  submitting: boolean;
}

export const MemberRegisterForm = ({ submit, submitting }: IProps) => {
  const [agreeTerms, setAgreeTerms] = useState(false);

  return (
    <Form
      name="member_register"
      initialValues={{ remember: true, gender: 'male' }}
      onFinish={(values) => {
        if (!agreeTerms) return message.error('Please agree our Terms');

        return submit(values);
      }}
      layout="vertical"
    >
      <Row>
        <Col xs={24}>
          <Form.Item
            name="username"
            label="Username"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your username!' },
              {
                pattern: new RegExp(/^[a-z0-9]+$/g),
                message: 'Username must contain lowercase alphanumerics only'
              },
              {
                min: 3,
                message: 'Username must containt at least 3 characters'
              }
            ]}
            hasFeedback
          >
            <Input placeholder="Username" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="email"
            label="Email"
            validateTrigger={['onChange', 'onBlur']}
            hasFeedback
            rules={[
              {
                type: 'email',
                message: 'Invalid email address!'
              },
              {
                required: true,
                message: 'Please input your email address!'
              }
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="password"
            validateTrigger={['onChange', 'onBlur']}
            hasFeedback
            label="Password"
            rules={[
              {
                pattern: new RegExp(/^(?=.{6,})/g), // new RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g),
                message: 'Password must have minimum 6 characters' // 'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
              },
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        </Col>
        <Col xs={24}>
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
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <div className="agree-term">
            <p>
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              >
                I agree to the terms
              </Checkbox>
            </p>
            <p>
              Already have an account?
              {' '}
              <Link href="/auth/login">
                <a>Click here to Login</a>
              </Link>
            </p>
          </div>
        </Col>
        <Col xs={24}>
          <div className="model-register">
            <p>
              You want to register model?
              {' '}
              <Link href="/auth/model-register">
                <a>Here</a>
              </Link>
            </p>
          </div>
        </Col>
      </Row>
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          disabled={submitting}
          loading={submitting}
          className="auth-btn"
        >
          Next
        </Button>
      </Form.Item>
    </Form>
  );
};
