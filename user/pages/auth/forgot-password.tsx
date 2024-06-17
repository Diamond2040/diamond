/* eslint-disable react/no-did-update-set-state */
import { PureComponent } from 'react';
import {
  Form, Input, Button, Layout, message, Row, Col
} from 'antd';
import { authService } from '@services/index';
import Head from 'next/head';
import { IForgot } from 'src/interfaces';
import { connect } from 'react-redux';
import Link from 'next/link';
import './index.less';
import Router from 'next/router';

interface IProps {
  auth: any;
  ui: any;
  forgot: Function;
  forgotData: any;
  query: any;
}

interface IState {
  type: string;
  submiting: boolean;
  submited: boolean;
  countTime: number;
}

class Forgot extends PureComponent<IProps, IState> {
  static authenticate = false;

  static layout = 'primary';

  _intervalCountdown: any;

  state = {
    type: 'user',
    submiting: false,
    submited: false,
    countTime: 60
  };

  static async getInitialProps({ ctx }) {
    const { query } = ctx;
    return { query };
  }

  componentDidMount() {
    const { query } = this.props;
    if (query && query.type) {
      this.setState({
        type: query.type
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.countTime === 0) {
      this._intervalCountdown && clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
    }
  }

  componentWillUnmount() {
    this._intervalCountdown && clearInterval(this._intervalCountdown);
  }

  handleReset = async (data: IForgot) => {
    const { type } = this.state;
    await this.setState({ submiting: true });
    try {
      await authService.resetPassword({
        ...data,
        type
      });
      message.success('An email has been sent to you to reset your password');
      this.handleCountdown();
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Error occured, please try again later');
    } finally {
      await this.setState({ submiting: false });
    }
  };

  handleCountdown = async () => {
    const { countTime } = this.state;
    if (countTime === 0) {
      clearInterval(this._intervalCountdown);
      this.setState({ countTime: 60 });
      return;
    }
    this.setState({ countTime: countTime - 1, submited: true });
    this._intervalCountdown = setInterval(this.coundown.bind(this), 1000);
  }

  coundown() {
    const { countTime } = this.state;
    this.setState({ countTime: countTime - 1 });
  }

  render() {
    const { ui } = this.props;
    const { submiting, countTime, submited } = this.state;
    const { siteName } = ui;
    return (
      <>
        <Head>
          <title>
            {siteName}
            {' '}
            | Recover Your Account
          </title>
        </Head>
        <Layout>
          <div
            className="login-page"
          >
            <div className="login-box">
              <div className="login-logo">
                <Link href="/home">
                  <a>
                    {ui.logo ? <img alt="logo" src={ui.logo} /> : ui.siteName}
                  </a>
                </Link>
              </div>
              <div className="login-form">
                <h2 className="title">Recover Your Account</h2>
                <Form name="login-form" onFinish={this.handleReset.bind(this)}>
                  <Row>
                    <Col lg={24} md={24} sm={24} xs={24} className="padding-0">
                      <p className="forgotpassword-label">Account E-mail</p>
                      <Form.Item
                        hasFeedback
                        name="email"
                        validateTrigger={['onChange', 'onBlur']}
                        rules={[
                          {
                            type: 'email',
                            message: 'Invalid email format'
                          },
                          {
                            required: true,
                            message: 'Please enter your E-mail!'
                          }
                        ]}
                      >
                        <Input placeholder="Enter E-mail" />
                      </Form.Item>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <Button
                        onClick={() => Router.push('/auth/login')}
                        className="primary cancel"
                      >
                        Go to login
                      </Button>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <Button
                        className="primary next"
                        type="primary"
                        htmlType="submit"
                        disabled={submiting || countTime < 60}
                        loading={submiting || countTime < 60}
                      >
                        {(countTime < 60) || submited ? 'Resend' : 'Next'}
                        {' '}
                        {countTime < 60 && `${countTime}s`}
                      </Button>
                    </Col>
                    <Col span={24}>
                      <p className="link-auth-register">
                        Don&apos;t have an account yet?
                        <Link href="/auth/register">
                          <a> Create an account.</a>
                        </Link>
                      </p>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStatetoProps = (state: any) => ({
  ui: { ...state.ui }
});

export default connect(mapStatetoProps)(Forgot);
