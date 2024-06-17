import { PureComponent } from 'react';
import Head from 'next/head';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { scheduleService } from 'src/services';
import BookingTableList from '@components/booking/table-list';
import { connect } from 'react-redux';
import { IUIConfig, IUser } from 'src/interfaces';
import './index.less';

interface IProps {
  ui: IUIConfig;
  user: IUser;
}

class UserBookingPage extends PureComponent<IProps> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {
      current: 1
    } as any,
    searching: false,
    list: [] as any,
    limit: 10,
    filter: {} as any,
    sortBy: 'createdAt',
    sort: 'desc'
  };

  async componentDidMount() {
    this.search();
  }

  handleTableChange = async (pagination, filters, sorter) => {
    const { pagination: paginationState } = this.state;
    const pager = { ...paginationState };
    pager.current = pagination.current;
    await this.setState({
      pagination: pager,
      sortBy: sorter.field || 'createdAt',
      // eslint-disable-next-line no-nested-ternary
      sort: sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    });
    this.search();
  };

  async handleFilter(filter) {
    await this.setState({ filter });
    this.search();
  }

  async search() {
    try {
      const {
        filter, limit, sort, sortBy, pagination
      } = this.state;
      await this.setState({ searching: true });
      const resp = await scheduleService.performerFindBooking({
        ...filter,
        limit,
        offset: (pagination.current - 1) * limit,
        sort,
        sortBy
      });
      await this.setState({
        searching: false,
        list: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total,
          pageSize: limit
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
      await this.setState({ searching: false });
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const { ui, user } = this.props;
    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | My Bookings
          </title>
        </Head>
        <Page>
          <div className="main-container">
            <div className="page-heading">
              <span className="title-bookings">My bookings </span>
            </div>
            <div style={{ marginBottom: '20px' }} />
            <BookingTableList
              user={user}
              dataSource={list}
              rowKey="_id"
              loading={searching}
              pagination={{ ...pagination, showSizeChanger: false }}
              onChange={this.handleTableChange.bind(this)}
              onForceRender={this.search.bind(this)}
            />
          </div>
        </Page>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  user: { ...state.user.current }
});
export default connect(mapStates)(UserBookingPage);
