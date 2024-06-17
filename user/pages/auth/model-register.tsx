/* eslint-disable prefer-promise-reject-errors */
import {
  Layout, message
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import './index.less';
import {
  IUIConfig, IFanRegister, ICountry
} from 'src/interfaces';
import { authService } from '@services/auth.service';
import ModelRegisterForm from '@components/auth/model-register-form';
import Router from 'next/router';
import Header from '@components/common/layout/header';
import Footer from '@components/common/layout/footer';

interface IProps {
  ui: IUIConfig;
  countries: ICountry[];
}

class ModelRegister extends PureComponent<IProps> {
  static layout = 'blank';

  async handleRegister(data: IFanRegister, files) {
    try {
      const resp = await authService.performerRegister(data, files) as any;
      message.success(resp?.data?.message || 'Thank you, your account has been created.', 5);

      Router.push('/auth/login');
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error.message || 'Username or email has been taken.');
    }
  }

  render() {
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Create Model Account
          </title>
        </Head>
        <Header />
        <div className="login-page model-register-page">
          <div className="login-box" style={{ maxWidth: '800px' }}>
            <div className="login-logo">
              <Link href="/home">
                <a>
                  {ui.logo ? <img alt="logo" src={ui.logo} /> : ui.siteName}
                </a>
              </Link>
            </div>
            <div className="login-form">
              <h1 className="title">Create Account</h1>
              <h4 className="title description">
                Welcome to
                {' '}
                {ui?.siteName || ''}
              </h4>
              <ModelRegisterForm onSubmit={this.handleRegister} />
            </div>
          </div>
        </div>
        <Footer />
      </Layout>
    );
  }
}
const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui }
});

export default connect(mapStatesToProps)(ModelRegister);
