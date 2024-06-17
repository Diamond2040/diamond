import { PureComponent } from 'react';
import { Layout, Button, Result } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import Head from 'next/head';
import { updateCurrentUser } from '@redux/user/actions';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import { IUser, IUIConfig } from 'src/interfaces';
import Router from 'next/router';

interface IProps {
  user: IUser;
  clearCart: Function;
  updateCurrentUser: Function;
  ui: IUIConfig;
}

class PaymentSuccess extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  async updateCurrentUser() {
    const { updateCurrentUser: handleUpdateUser } = this.props;
    const token = authService.getToken();
    if (token) {
      const user = await userService.me({
        Authorization: token
      });
      if (!user.data._id) {
        return;
      }
      handleUpdateUser(user.data);
    }
  }

  render() {
    const { ui, user } = this.props;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Payment success
          </title>
        </Head>
        <div className="main-container">
          <Result
            status="success"
            title="Payment Success"
            subTitle={`Hi ${user?.name || user?.username || `${user?.firstName} ${user?.lastName}` || 'there'}, your payment has been successful`}
            extra={[
              <Button className="secondary" key="console" onClick={() => Router.push('/home')}>
                <HomeOutlined />
                BACK HOME
              </Button>
            ]}
          />
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  user: state.user.current,
  ui: state.ui
});

const mapDispatch = { updateCurrentUser };
export default connect(mapStates, mapDispatch)(PaymentSuccess);
