import React, { PureComponent } from 'react';
import dynamic from 'next/dynamic';
import { Layout, BackTop } from 'antd';
import { connect } from 'react-redux';
import { Router as RouterEvent } from 'next/router';
import { IUIConfig } from 'src/interfaces/ui-config';
import './primary-layout.less';
import NotificationAlert from '@components/subscription/notification-alert';

const Header = dynamic(() => import('@components/common/layout/header'));
const Footer = dynamic(() => import('@components/common/layout/footer'));
const Loader = dynamic(() => import('@components/common/base/loader'));

interface DefaultProps extends IUIConfig {
  children: any;
  config: IUIConfig;
}
interface IState{
  routerChange:boolean;
}

export async function getStaticProps() {
  return {
    props: {}
  };
}

class PrimaryLayout extends PureComponent<DefaultProps, IState> {
  constructor(props) {
    super(props);
    this.state = {
      routerChange: false
    };
  }

  componentDidMount() {
    if (process.browser) {
      this.handleStateChange();

      window.addEventListener('scroll', () => {
        const doc = document.documentElement;
        const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);

        if (top > 100) {
          const { body } = document;
          body.classList.add('header-sticky');
        } else {
          const { body } = document;
          body.classList.remove('header-sticky');
        }
      });
    }
  }

  handleStateChange() {
    RouterEvent.events.on('routeChangeStart', async () => this.setState({ routerChange: true }));
    RouterEvent.events.on('routeChangeComplete', async () => this.setState({ routerChange: false }));
  }

  render() {
    const {
      children
    } = this.props;
    const {
      routerChange
    } = this.state;

    return (
      <Layout>
        <div
          className="container"
          id="primaryLayout"
        >
          <Header />
          <NotificationAlert />
          <Layout.Content
            className="content main-content"
          >
            {routerChange && <Loader />}
            {children}
          </Layout.Content>
          <BackTop className="backTop" />
          <Footer />
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ...state.ui
});
const mapDispatchToProps = { };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
