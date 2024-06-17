import { PureComponent } from 'react';
import {
  Layout, message, Button, Descriptions
} from 'antd';
import Head from 'next/head';
import { Booking, IUIConfig } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { scheduleService } from 'src/services';
import { connect } from 'react-redux';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';
import { formatDate } from '@lib/date';
import './index.less';

const { Item } = Descriptions;

interface IProps {
  id: string;
  ui: IUIConfig;
}

interface IStates {
  booking: Booking;
}

class OrderDetailPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      booking: null
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const { id } = this.props;
      const resp = await scheduleService.performerFindOneBooking(id);
      this.setState({
        booking: resp.data
      });
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
      Router.back();
    }
  }

  render() {
    const { ui } = this.props;
    const { booking } = this.state;

    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | Booking ${booking?.scheduleInfo?.name}`}
          </title>
        </Head>
        <div className="main-container">
          <BreadcrumbComponent
            breadcrumbs={[
              {
                title: 'My bookings',
                href: '/model/bookings' || '/user/bookings'
              },
              {
                title: booking?.scheduleInfo?.name
                  ? `${booking?.scheduleInfo?.name}`
                  : 'Booking Detail'
              }
            ]}
          />
          <Page>
            {booking && (
              <div className="main-container">
                <Descriptions title="Booking Info">
                  <Item label="Start At">
                    {booking?.startAt
                      && formatDate(booking.startAt, 'DD/MM/YYYY HH:mm')}
                  </Item>
                  <Item label="Duration">
                    {booking?.duration}
                    {' '}
                    minutes
                  </Item>
                  <Item label="Status">{booking?.status}</Item>
                  <Item label="Message">{booking?.message}</Item>
                </Descriptions>
                <Descriptions title="Schedule Info">
                  {booking?.scheduleInfo?._id ? (
                    <>
                      <Item label="Title">{booking?.scheduleInfo?.name}</Item>
                      <Item label="Price">{booking?.scheduleInfo?.price}</Item>
                      <Item label="Status">
                        {booking?.scheduleInfo?.status}
                      </Item>
                      <Item label="Start At">
                        {booking?.scheduleInfo?.startAt
                          && formatDate(
                            booking?.scheduleInfo?.startAt,
                            'DD/MM/YYYY HH:mm'
                          )}
                      </Item>
                      <Item label="End At">
                        {booking?.scheduleInfo?.endAt
                          && formatDate(
                            booking?.scheduleInfo?.endAt,
                            'DD/MM/YYYY HH:mm'
                          )}
                      </Item>
                      <Item label="Description">
                        {booking?.scheduleInfo?.description}
                      </Item>
                    </>
                  ) : (
                    <p>Not Found</p>
                  )}
                </Descriptions>
                <Descriptions title="User Info">
                  <Item label="Username">
                    {booking?.sourceInfo?.name || booking?.sourceInfo?.username}
                  </Item>
                  <Item label="Email">{booking?.sourceInfo?.email}</Item>
                </Descriptions>
                <div style={{ marginBottom: '10px' }}>
                  <Button danger onClick={() => Router.back()}>
                    Back
                  </Button>
                </div>
              </div>
            )}
          </Page>
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

export default connect(mapStates)(OrderDetailPage);
