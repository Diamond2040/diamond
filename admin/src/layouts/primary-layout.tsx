import { PureComponent } from 'react';
import { Layout, Drawer, BackTop } from 'antd';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { connect } from 'react-redux';
import { updateUIValue, loadUIValue } from 'src/redux/ui/actions';
import Sider from '@components/common/layout/sider';
import { IUIConfig } from 'src/interfaces/ui-config';
import {
  ContainerOutlined,
  UserOutlined,
  WomanOutlined,
  FileImageOutlined,
  HeartOutlined,
  MenuOutlined,
  UnorderedListOutlined,
  SettingOutlined,
  WarningOutlined
} from '@ant-design/icons';
import Header from '@components/common/layout/header';
import { Router } from 'next/router';
import Loader from '@components/common/base/loader';
import './primary-layout.less';

interface DefaultProps extends IUIConfig {
  children: any;
  config: IUIConfig;
  updateUIValue: Function;
  loadUIValue: Function;
}

export async function getStaticProps() {
  return {
    props: {}
  };
}

class PrimaryLayout extends PureComponent<DefaultProps> {
  state = {
    isMobile: false,
    routerChange: false
  };

  enquireHandler: any;

  componentDidMount() {
    const { loadUIValue: handleLoadUI } = this.props;
    handleLoadUI();
    this.enquireHandler = enquireScreen((mobile) => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile
        });
      }
    });

    process.browser && this.handleStateChange();
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  handleStateChange() {
    Router.events.on('routeChangeStart', async () => this.setState({ routerChange: true }));
    Router.events.on('routeChangeComplete', async () => this.setState({ routerChange: false }));
  }

  onThemeChange = (theme: string) => {
    const { updateUIValue: updateUI } = this.props;
    updateUI({ theme });
  };

  onCollapseChange = (collapsed) => {
    const { updateUIValue: updateUI } = this.props;
    updateUI({ collapsed });
  };

  render() {
    const {
      children, collapsed, logo, siteName, theme
    } = this.props;
    const { isMobile, routerChange } = this.state;
    const headerProps = {
      collapsed,
      theme,
      onCollapseChange: this.onCollapseChange
    };

    const sliderMenus = [
      {
        id: 'posts',
        name: 'Posts',
        icon: <ContainerOutlined />,
        children: [
          {
            id: 'post-page',
            name: 'Posts created',
            route: '/posts?type=page'
          },
          {
            id: 'page-create',
            name: 'New post',
            route: '/posts/create?type=page'
          }
        ]
      },
      {
        id: 'report',
        name: 'Violations',
        icon: <WarningOutlined />,
        children: [
          {
            id: 'report-listing',
            name: 'Reported violations',
            route: '/abuse-report'
          }
        ]
      },
      {
        id: 'menu',
        name: 'Menus',
        icon: <MenuOutlined />,
        children: [
          {
            id: 'menu-listing',
            name: 'Existing menu options',
            route: '/menu'
          },
          {
            name: 'New menu',
            id: 'create-menu',
            route: '/menu/create'
          }
        ]
      },
      {
        id: 'banner',
        name: 'Banners',
        icon: <FileImageOutlined />,
        children: [
          {
            id: 'banner-listing',
            name: 'Existing Banners',
            route: '/banner'
          },
          {
            name: 'New banner',
            id: 'upload-banner',
            route: '/banner/upload'
          }
        ]
      },
      {
        id: 'accounts',
        name: 'Users',
        icon: <UserOutlined />,
        children: [
          {
            name: 'User list',
            id: 'users',
            route: '/users'
          },
          {
            name: 'New user',
            id: 'users-create',
            route: '/users/create'
          }
        ]
      },
      {
        id: 'categories',
        name: 'Categories',
        icon: <UnorderedListOutlined />,
        children: [
          {
            id: 'categories-listing',
            name: 'Current categories',
            route: '/categories'
          },
          {
            id: 'create-new',
            name: 'New category',
            route: '/categories/create'
          }
        ]
      },
      {
        id: 'attributes',
        name: 'Attribute list',
        icon: <ContainerOutlined />,
        children: [
          {
            id: 'attributes-list',
            name: 'List Attributes ',
            route: '/custom-attributes'
          },
          {
            id: 'attributes-create',
            name: 'Create Attributes',
            route: '/custom-attributes/create'
          }
        ]
      },
      {
        id: 'performers',
        name: 'Escorts',
        icon: <WomanOutlined />,
        children: [
          {
            name: 'Current Escorts',
            id: 'listing',
            route: '/performer'
          },
          {
            name: 'Create an Escort Account',
            id: 'create-performers',
            route: '/performer/create'
          }
        ]
      },
      {
        id: 'payments',
        name: 'Payment History',
        icon: <ContainerOutlined />,
        children: [
          {
            id: 'payment-listing',
            name: 'Payment History',
            route: '/payment-history'
          }
        ]
      },
      {
        id: 'order',
        name: 'Orders',
        icon: <ContainerOutlined />,
        children: [
          {
            id: 'order-listing',
            name: 'Ordered subscriptions ',
            route: '/order'
          }
        ]
      },
      {
        id: 'subscription-package',
        name: 'Subscription Packages',
        icon: <HeartOutlined />,
        children: [
          {
            id: 'package-list',
            name: 'Current packages',
            route: '/subscription-package'
          },
          {
            name: 'Create new',
            id: 'create-subscription-package',
            route: '/subscription-package/create'
          }
        ]
      },
      {
        id: 'subscriptions',
        name: 'Admin-created subscriptions',
        icon: <HeartOutlined />,
        children: [
          {
            name: 'Subscriptions',
            id: 'subscription-list',
            route: '/subscription'
          },
          {
            name: 'Create new',
            id: 'create-subscription',
            route: '/subscription/create'
          }
        ]
      },
      {
        id: 'settings',
        name: 'Settings',
        icon: <SettingOutlined />,
        children: [
          {
            id: 'system-settings',
            route: '/settings',
            as: '/settings',
            name: 'System settings'
          },
          {
            name: 'Account settings',
            id: 'account-settings',
            route: '/account/settings'
          }
        ]
      }
    ];
    const siderProps = {
      collapsed,
      isMobile,
      logo,
      siteName,
      theme,
      menus: sliderMenus,
      onCollapseChange: this.onCollapseChange,
      onThemeChange: this.onThemeChange
    };

    return (
      <>
        <Layout>
          {isMobile ? (
            <Drawer
              maskClosable
              closable={false}
              onClose={this.onCollapseChange.bind(this, !collapsed)}
              visible={!collapsed}
              placement="left"
              width={257}
              style={{
                padding: 0,
                height: '100vh'
              }}
            >
              <Sider {...siderProps} />
            </Drawer>
          ) : (
            <Sider {...siderProps} />
          )}
          <div className="container" id="primaryLayout">
            <Header {...headerProps} />
            <Layout.Content className="content" style={{ position: 'relative' }}>
              {routerChange && <Loader spinning />}
              {children}
            </Layout.Content>
            <BackTop className="backTop" target={() => document.querySelector('#primaryLayout') as any} />
          </div>
        </Layout>
      </>
    );
  }
}

const mapStateToProps = (state: any) => ({
  ...state.ui,
  auth: state.auth
});
const mapDispatchToProps = { updateUIValue, loadUIValue };

export default connect(mapStateToProps, mapDispatchToProps)(PrimaryLayout);
