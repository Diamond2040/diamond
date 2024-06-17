import React, { PureComponent } from 'react';
import Head from 'next/head';
import { Layout } from 'antd';
import { MySchedules } from '@components/performer/schedules/my-schedules';
import { IUIConfig, IUser } from 'src/interfaces';
import { connect } from 'react-redux';

interface P {
  ui: IUIConfig;
  user: IUser
}

class SchedulesPage extends PureComponent<P> {
  static authenticate = true;

  render() {
    const { ui } = this.props;
    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Schedule
          </title>
        </Head>
        <Layout>
          <MySchedules />
        </Layout>
      </>
    );
  }
}
const mapStates = (state: any) => ({
  ui: { ...state.ui },
  user: { ...state.user.current }
});

const mapDispatch = {};
export default connect(mapStates, mapDispatch)(SchedulesPage);
