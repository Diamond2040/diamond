import React from 'react';
import App from 'next/app';
import { Provider } from 'react-redux';
import nextCookie from 'next-cookies';
import withReduxSaga from '@redux/withReduxSaga';
import { Store } from 'redux';
import BaseLayout from '@layouts/base-layout';
import {
  authService, userService, settingService, utilsService
} from '@services/index';
import { setGlobalConfig } from '@services/config';
import Router from 'next/router';
import { NextPageContext } from 'next';
import { loginSuccess } from '@redux/auth/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { updateUIValue } from '@redux/ui/actions';
import { Socket } from 'src/socket';
import Head from 'next/head';
import { loadInitialData, updateSettings } from '@redux/settings/actions';
import '../style/index.less';
import storeHolder from '@lib/storeHolder';

declare global {
  interface Window {
    ReactSocketIO: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

function redirectLogin(ctx: any) {
  if (process.browser) {
    authService.removeToken();
    Router.push('/auth/login');
    return;
  }

  // fix for production build
  ctx.res.clearCookie && ctx.res.clearCookie('token');
  ctx.res.clearCookie && ctx.res.clearCookie('role');
  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/auth/login' });
  ctx.res.end && ctx.res.end();
}

async function auth(
  ctx: NextPageContext,
  authenticate: boolean,
  noredirect: boolean
) {
  try {
    const { store } = ctx;
    const state = store.getState();
    if (state.auth && state.auth.loggedIn) {
      return;
    }
    // TODO - move to a service
    const { token } = nextCookie(ctx);
    if (token) {
      authService.setToken(token);
      const user = await userService.me({
        Authorization: token
      });
      // TODO - check permission
      store.dispatch(loginSuccess());
      store.dispatch(updateCurrentUser(user.data));
      return;
    }

    if (authenticate && !noredirect) redirectLogin(ctx);
  } catch (e) {
    redirectLogin(ctx);
  }
}

async function updateSettingsStore(ctx: NextPageContext, settings) {
  const { store } = ctx;
  store.dispatch(
    updateUIValue({
      logo: settings.logoUrl,
      siteName: settings.siteName,
      favicon: settings.favicon,
      loginPlaceholderImage: settings.loginPlaceholderImage,
      menus: settings.menus,
      footerContent: settings.footerContent,
      countries: settings.countries
    })
  );

  store.dispatch(updateSettings(settings));
}

interface AppComponent extends NextPageContext {
  layout: string;
}

interface IApp {
  store: Store;
  layout: string;
  Component: AppComponent;
  settings: any;
  config: any;
}

const publicConfig = {} as any;
class Application extends App<IApp> {
  // TODO - consider if we need to use get static props in children component instead?
  // or check in render?
  static async getInitialProps({ Component, ctx }) {
    // load configuration from ENV and put to config
    if (!process.browser) {
      // eslint-disable-next-line global-require
      const dotenv = require('dotenv');
      const myEnv = dotenv.config().parsed;

      // publish to server config with app
      setGlobalConfig(myEnv);

      // load public config and api-endpoint?
      Object.keys(myEnv).forEach((key) => {
        if (key.indexOf('NEXT_PUBLIC_') === 0) {
          publicConfig[key] = myEnv[key];
        }
      });
    }
    // won't check auth for un-authenticated page such as login, register
    // use static field in the component
    const { noredirect, authenticate } = Component;
    await auth(ctx, authenticate, noredirect);
    const { token } = nextCookie(ctx);
    ctx.token = token || '';
    // server side to load settings, once time only
    let settings = {};
    if (!process.browser) {
      const [setting, countryList] = await Promise.all([
        settingService.all('all', true),
        utilsService.countriesList()
      ]);
      settings = { ...setting.data, countries: countryList.data };
      await updateSettingsStore(ctx, settings);
    }
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps({ ctx });
    }
    return {
      settings,
      pageProps,
      layout: Component.layout,
      config: publicConfig
    };
  }

  constructor(props) {
    super(props);
    setGlobalConfig(this.props.config);
  }

  componentDidMount() {
    const store = storeHolder.getStore();
    store.dispatch(loadInitialData());
  }

  render() {
    const {
      Component, pageProps, store, settings
    } = this.props;
    const { layout } = Component;
    return (
      <Provider store={store}>
        <Head>
          <title>{settings?.siteName}</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <Socket>
          <BaseLayout layout={layout} maintenance={settings.maintenanceMode}>
            <Component {...pageProps} />
          </BaseLayout>
        </Socket>
      </Provider>
    );
  }
}

export default withReduxSaga(Application);
