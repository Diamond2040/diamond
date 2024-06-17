import { PureComponent } from 'react';
import {
  Form, Button, Layout, Input, message, Col, Row
} from 'antd';
import Head from 'next/head';
import { connect } from 'react-redux';
import { IUIConfig } from 'src/interfaces';
import './index.less';
import Router from 'next/router';
import { performerService } from '@services/performer.service';

const { TextArea } = Input;

interface IProps {
  ui: IUIConfig;
  id: string;
  query: any;
}

class ContactPage extends PureComponent<IProps> {
  static authenticate = true;

  static noredirect: boolean = true;

  static async getInitialProps() {
    return {
      query: Router.query
    };
  }

  state = {
    submiting: false
  }

  async onFinish(values) {
    const { query, id } = this.props;
    const username = id || query.id || query.username;
    this.setState({ submiting: true });
    try {
      await performerService.contact(username, values);
      message.success('Your message has been sent successfully');
      setTimeout(() => {
        Router.back();
      }, 2000);
    } catch (e) {
      message.error('Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
  }

  render() {
    const { ui } = this.props;
    const { submiting } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {' '}
            {ui?.siteName}
            {' '}
            | Contact
            {' '}
          </title>
        </Head>
        <h1 className="getInTouch">GET IN TOUCH</h1>
        <div className="contact-container">
          <Form
            layout="vertical"
            name="contact-form"
            onFinish={this.onFinish.bind(this)}
          >
            <Row>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{ required: true, message: 'Tell us your name' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col lg={12} md={12} sm={24} xs={24}>
                <Form.Item
                  name="email"
                  label="Email"
                  rules={[
                    {
                      required: true,
                      message: 'Tell us your e-mail address.'
                    },
                    { type: 'email', message: 'Invalid email format' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="subject"
                  label="Subject"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  name="message"
                  label="Message"
                  rules={[
                    {
                      min: 20,
                      message: 'Please input at least 20 characters.'
                    }
                  ]}
                >
                  <TextArea minLength={20} maxLength={250} showCount rows={3} />
                </Form.Item>
              </Col>
            </Row>
            <Button
              type="primary"
              htmlType="submit"
              loading={submiting}
            >
              Submit
            </Button>
          </Form>
        </div>
      </Layout>
    );
  }
}
const mapStates = (state: any) => ({
  ui: state.ui
});
export default connect(mapStates)(ContactPage);
