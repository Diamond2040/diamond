import {
  Form,
  Input,
  Button,
  Layout,
  message,
  Row,
  Col
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { authService } from '@services/index';
import Link from 'next/link';
import { IUIConfig } from 'src/interfaces';
import './index.less';

interface IProps {
  ui: IUIConfig;
  submiting: boolean;
}

class Login extends PureComponent<IProps> {
  static authenticate = false;

  static layout = 'primary';

  state = {
    loading: false,
    submiting: false
  }

  async handleResendEmail(email) {
    try {
      this.setState({ submiting: true });
      await authService.resendEmailVerificaton(email);
      message.success('Email has been sent to your registered email address');
    } catch (e) {
      message.error('Error occured, please try again later');
      this.setState({ submiting: false });
    }
  }

  render() {
    const { ui } = this.props;
    const { loading, submiting } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Resend email verification
          </title>
        </Head>
        <div className="login-page">
          <div className="login-box">
            <div className="login-logo">
              <Link href="/home">
                <a>
                  {ui.logo ? <img alt="logo" src={ui.logo} /> : ui.siteName}
                </a>
              </Link>
            </div>
            <div className="login-form">
              <p className="title">
                Resend email verification
              </p>
              <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={this.handleResendEmail.bind(this)}
                layout="vertical"
              >
                <Row gutter={24}>
                  <Col span={24}>
                    <Form.Item
                      name="email"
                      hasFeedback
                      label="Email"
                      rules={[
                        { required: true, message: 'Email is required' }
                      ]}
                    >
                      <Input type="email" placeholder="Enter your email address" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item>
                      <Button
                        loading={loading}
                        disabled={submiting}
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Send
                      </Button>
                      <div className="link-path">
                        <a href="/auth/login">Login</a>
                        <a href="/auth/forgot-password">Forgot password</a>
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui }
});
export default connect(mapStatesToProps)(Login) as any;
