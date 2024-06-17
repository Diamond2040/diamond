import React, { PureComponent } from 'react';
import Head from 'next/head';
import { Layout, message } from 'antd';
import { UserModelBooking } from '@components/user/model-booking';
import {
  IUIConfig, IUser, IPerformer
} from 'src/interfaces';
import { connect } from 'react-redux';
import Router, { withRouter } from 'next/router';
import { performerService } from '@services/index';

interface IProps {
  router: any;
  ui: IUIConfig;
  currentUser: IUser | IPerformer
}
interface IStates {
  performer: IPerformer
}
class BookingPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    if (!ctx.query.username) {
      if (process.browser) {
        Router.push('/');
        return;
      }

      ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/' });
      ctx.res.end && ctx.res.end();
    }
  }

  state = {
    performer: null
  }

  componentDidMount() {
    const { router } = this.props;
    const { username, performer } = router.query;
    if (!username) {
      Router.back();
      return;
    }
    if (performer) {
      this.setState({ performer: JSON.parse(performer) });
    } else {
      this.getPerformer(username);
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  }

  async getPerformer(username) {
    try {
      const resp = await (await performerService.findOne(username)).data;
      this.setState({ performer: resp });
    } catch (e) {
      const err = await e;
      message.error(err.message || 'Error occured, please try again later');
      Router.back();
    }
  }

  render() {
    const { ui, currentUser } = this.props;
    const { performer } = this.state;
    return (
      <>
        <Head>
          <title>
            {`${ui?.siteName} | Booking ${performer?.username}`}
          </title>
        </Head>
        <Layout.Content>
          <div className="main-container">
            <UserModelBooking
              currentUser={currentUser}
              performer={performer}
            />
          </div>
        </Layout.Content>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  currentUser: { ...state.user.current }
});

export default connect(
  mapStates
)(withRouter(BookingPage));
