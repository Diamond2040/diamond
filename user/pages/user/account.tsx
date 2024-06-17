import { PureComponent } from 'react';
import {
  Layout, Tabs, message
} from 'antd';
import Head from 'next/head';
import { connect } from 'react-redux';
import Page from '@components/common/layout/page';
import { UserAccountForm } from '@components/user/account-form';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { IUser, IUserFormData } from 'src/interfaces/user';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import {
  updateUser, updateCurrentUserAvatar, updatePassword
} from 'src/redux/user/actions';
import { getResponseError } from '@lib/utils';
import { IUIConfig } from 'src/interfaces';
import './index.less';

interface IProps {
  name: string;
  username: string;
  email: string;
  onFinish(): Function;
  user: IUser;
  updating: boolean;
  updateUser: Function;
  updateCurrentUserAvatar: Function;
  updatePassword: Function;
  updateSuccess: boolean;
  error: any;
  ui: IUIConfig;
}

class UserAccountSettingPage extends PureComponent<IProps> {
  static authenticate = true;

  state = {
    pwUpdating: false
  };

  componentDidUpdate(preProps: IProps) {
    const { error, updateSuccess } = this.props;
    if (error !== preProps.error) {
      message.error(getResponseError(error));
    }
    if (updateSuccess && updateSuccess !== preProps.updateSuccess) {
      message.success('Changes saved.');
    }
  }

  onFinish(data: IUserFormData) {
    const { updateUser: handleUpdateUser } = this.props;
    handleUpdateUser(data);
  }

  uploadAvatar(data) {
    const { updateCurrentUserAvatar: updateCurrentAvatar } = this.props;
    updateCurrentAvatar(data.response.data.url);
  }

  updatePassword(data: any) {
    const { updatePassword: handleUpdatePassword } = this.props;
    handleUpdatePassword(data.password);
  }

  render() {
    const { user, updating, ui } = this.props;
    const { pwUpdating } = this.state;
    const uploadHeader = {
      authorization: authService.getToken()
    };
    return (
      <Layout>
        <Head>
          <title>
            {' '}
            {ui && ui.siteName}
            {' '}
            | Account Settings
            {' '}
          </title>
        </Head>
        <div className="main-container user-account-layout">
          <Page className="user-account-container">
            <Tabs
              defaultActiveKey="basic"
              tabPosition="top"
              className="nav-tabs"
            >
              <Tabs.TabPane tab={<span>Basic Info</span>} key="basic">
                <UserAccountForm
                  onFinish={this.onFinish.bind(this)}
                  updating={updating}
                  user={user}
                  options={{
                    uploadHeader,
                    avatarUrl: userService.getAvatarUploadUrl(),
                    uploadAvatar: this.uploadAvatar.bind(this)
                  }}
                />
              </Tabs.TabPane>
              <Tabs.TabPane tab={<span>Change password</span>} key="password">
                <UpdatePaswordForm
                  onFinish={this.updatePassword.bind(this)}
                  updating={pwUpdating}
                />
              </Tabs.TabPane>
            </Tabs>
          </Page>
        </div>
      </Layout>
    );
  }
}
const mapStates = (state) => ({
  user: state.user.current,
  updating: state.user.updating,
  error: state.user.error,
  updateSuccess: state.user.updateSuccess,
  ui: state.ui
});
const mapDispatch = { updateUser, updateCurrentUserAvatar, updatePassword };
export default connect(mapStates, mapDispatch)(UserAccountSettingPage);
