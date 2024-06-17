import { PureComponent } from 'react';
import { Layout, Button, Result } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import { IUIConfig } from 'src/interfaces';
import Router from 'next/router';
import './index.less';

interface IProps {
  ui: IUIConfig;
}

class EmailVerified extends PureComponent<IProps> {
  render() {
    const { ui } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Email verified
          </title>
        </Head>
        <div className="main-container">
          <Result
            status="success"
            title="Email address verified"
            subTitle="Please wait while the Admin verifies your ID and activates your account."
            extra={[
              <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
                <HomeOutlined />
                HOME
              </Button>,
              <Button key="buy" className="primary" onClick={() => Router.push('/auth/login')}>
                <LoginOutlined />
                LOG IN
              </Button>
            ]}
          />
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

const mapDispatch = { };
export default connect(mapStates, mapDispatch)(EmailVerified);
