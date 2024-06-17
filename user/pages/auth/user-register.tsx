/* eslint-disable prefer-promise-reject-errors */
import {
  Layout, message
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import './index.less';
import { IUIConfig, IFanRegister } from 'src/interfaces';
import { authService } from '@services/auth.service';
import { MemberRegisterForm } from '@components/auth/register-form';
import Router from 'next/router';
import Header from '@components/common/layout/header';
import Footer from '@components/common/layout/footer';

interface IProps {
  ui: IUIConfig;
  registerFan: Function;
  registerFanData: any;
  loggedIn: boolean;
}

interface IStates {
  submitting: boolean
}

class FanRegister extends PureComponent<IProps, IStates> {
  static layout = 'blank';

  static authenticate: boolean = false;

  static noredirect: boolean = true;

    state = {
      submitting: false
    };

    componentDidMount() {
      const { loggedIn } = this.props;
      if (loggedIn) {
        message.info('You have logged in, redirecting...');
        Router.push('/home');
      }
    }

  handleRegister = async (data: IFanRegister) => {
    try {
      this.setState({ submitting: true });
      const resp = await authService.register(data) as any;
      message.success(resp.data?.message || 'Thank you, your account has been created.', 5);
      setTimeout(() => Router.push('/auth/login'), 5000);
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error.message || 'Username or email has been taken.');
    } finally {
      this.setState({ submitting: false });
    }
  }

  render() {
    const { ui } = this.props;
    const { submitting } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Create Account
          </title>
        </Head>
        <Header />
        <div className="login-page user-register-page">
          <div className="login-box">
            <div className="login-logo">
              <Link href="/home">
                <a>
                  {ui.logo ? <img alt="logo" src={ui.logo} /> : ui.siteName}
                </a>
              </Link>
            </div>
            <div className="login-form">
              <h1 className="title">Create Account</h1>
              <p className="title description">
                Welcome to
                {' '}
                {ui?.siteName || ''}
              </p>
              <MemberRegisterForm
                submitting={submitting}
                submit={this.handleRegister}
              />
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }
}
const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  registerFanData: { ...state.auth.registerFanData },
  loggedIn: state.auth.loggedIn
});

export default connect(mapStatesToProps)(FanRegister);
