/* eslint-disable react/no-danger */
import { PureComponent } from 'react';
import Head from 'next/head';
import {
  Layout, Button
} from 'antd';
import { connect } from 'react-redux';
import Router from 'next/router';
import { cookieService, postService } from '@services/index';
import './auth/index.less';
import storeHolder from '@lib/storeHolder';

interface IProps {
  logo: string;
  siteName: string;
  welcome: any;
}
class Welcome extends PureComponent<IProps> {
  static authenticate = false;

  static async getInitialProps() {
    // postService.findById();
    const store = storeHolder.getStore();
    const { settings } = store.getState() as any;
    if (!settings.welcomePageId) return {};

    const resp = await postService.findById(settings.welcomePageId);
    return {
      welcome: {
        content: resp.data?.content,
        title: resp.data?.title,
        image: resp.data?.image
      }
    };
  }

  // componentDidMount() {
  //   const confirmAdult = cookieService.checkCookie('confirm_adult');
  //   confirmAdult && Router.replace('/home');
  // }

  confirm18 = () => {
    cookieService.setCookie('confirm_adult', 'true', 24);
    Router.push('/home');
  }

  render() {
    const {
      siteName, logo,
      welcome
    } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {siteName}
            {' '}
            | Welcome
          </title>
        </Head>
        <div className="main-container">
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'
          }}
          >
            <div className="term-welcome">
              <div className="left-group">
                {logo && <div className="site-logo"><img src={logo} alt="logo" /></div>}
                <h1 className="title">{welcome?.title}</h1>
                <div className="content" dangerouslySetInnerHTML={{ __html: welcome?.content }} />
                <div className="btns-group">
                  <Button className="primary" style={{ borderRadius: 0 }} onClick={this.confirm18}>I am at least 18 years old</Button>
                  <Button className="secondary" style={{ borderRadius: 0 }} onClick={() => { window.location.href = 'https://google.com'; }}>Take me back</Button>
                </div>
              </div>
              <div className="right-group" style={{ backgroundImage: `url(${welcome?.image?.url || '/bg-home.jpeg'})` }}>
                <span>18+ Warning</span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ...state.ui
});

const mapDispatch = { };

export default connect(mapStatesToProps, mapDispatch)(Welcome);
