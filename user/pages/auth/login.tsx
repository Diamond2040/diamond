import {
  Form,
  Checkbox,
  Input,
  Button,
  Row,
  Col,
  Layout
} from 'antd';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
  login, loginSuccess
} from '@redux/auth/actions';
import { updateCurrentUser } from '@redux/user/actions';
import { authService, userService } from '@services/index';
import Link from 'next/link';
import { IUIConfig } from 'src/interfaces';
import Router from 'next/router';
import { isEmail } from '@lib/string';
import './index.less';

interface IProps {
  loginAuth: any;
  login: Function;
  updateCurrentUser: Function;
  loginSuccess: Function;
  ui: IUIConfig
}

class Login extends PureComponent<IProps> {
  static authenticate = false;

  static layout = 'primary';

  state = {
    loginInput: ''
  }

  async componentDidMount() {
    this.redirectLogin();
  }

  // eslint-disable-next-line react/sort-comp
  onInputChange(e) {
    if (!e.target.value) return;
    this.setState({ loginInput: e.target.value });
  }

  async handleLogin(values: any) {
    const { login: handleLogin } = this.props;
    const { loginInput } = this.state;
    const data = values;
    const isInputEmail = isEmail(loginInput);
    data.loginUsername = !isInputEmail;
    if (isInputEmail) {
      data.email = loginInput;
    } else {
      data.username = loginInput;
    }
    localStorage.setItem('rememberMe', data.remember ? 'true' : 'false');
    return handleLogin(data);
  }

  async redirectLogin() {
    const { loginSuccess: handleLogin, updateCurrentUser: handleUpdateUser } = this.props;
    const token = authService.getToken();
    const rememberMe = process.browser && localStorage.getItem('rememberMe');
    if (!token || token === 'null' || rememberMe !== 'true') {
      return;
    }
    authService.setToken(token);
    try {
      const user = await userService.me({
        Authorization: token
      });
      // TODO - check permission
      if (!user.data._id) {
        return;
      }
      handleLogin();
      handleUpdateUser(user.data);
      Router.push('/home');
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('re-login', await e);
    }
  }

  render() {
    const { ui, loginAuth } = this.props;
    const { requesting } = loginAuth;
    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Login
          </title>
        </Head>
        <div className="login-page">
          <div className="login-box">
            <div className="login-logo">
              <Link href="/home">
                <a>
                  {ui.logo ? <img alt="logo" src={ui.logo} /> : ui.siteName}
                </a>
              </Link>
            </div>
            <div className="login-form">
              <p className="title">
                LOGIN
              </p>
              <Form
                name="normal_login"
                initialValues={{ remember: true }}
                onFinish={this.handleLogin.bind(this)}
                layout="vertical"
              >
                <Form.Item
                  name="email"
                  hasFeedback
                  label="Username / Email"
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Email or Username is missing' }
                  ]}
                >
                  <Input onChange={this.onInputChange.bind(this)} placeholder="Email address or Username" />
                </Form.Item>
                <Form.Item
                  style={{ marginBottom: 0 }}
                  label="Password"
                  name="password"
                  hasFeedback
                  validateTrigger={['onChange', 'onBlur']}
                  rules={[
                    { required: true, message: 'Please enter your password!' }
                  ]}
                >
                  <Input.Password iconRender={() => null} placeholder="Password" />
                </Form.Item>
                <Form.Item>
                  <Row className="check-box-and-link-forgot">
                    <Col span={12}>
                      <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col span={12} className="login-page-link-forgot-password">
                      <Link
                        href={{
                          pathname: '/auth/forgot-password',
                          query: { type: 'user' }
                        }}
                      >
                        <a>Forgot password?</a>
                      </Link>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item style={{ textAlign: 'center', marginBottom: '0px' }}>
                  <Button
                    loading={requesting}
                    disabled={requesting}
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                  >
                    LOGIN
                  </Button>
                  <p>
                    Don&apos;t have an account yet?
                    <Link
                      href={{ pathname: '/auth/user-register' }}
                      as="/auth/register"
                    >
                      <a> Create an account</a>
                    </Link>
                  </p>
                  <p>
                    Email verification,
                    <Link href="/auth/email-verification">
                      <a> Resend here</a>
                    </Link>
                  </p>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  loginAuth: { ...state.auth.loginAuth }
});

const mapDispatchToProps = {
  login, loginSuccess, updateCurrentUser
};
export default connect(mapStatesToProps, mapDispatchToProps)(Login) as any;
