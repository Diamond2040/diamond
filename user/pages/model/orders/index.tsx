import { PureComponent } from 'react';
import Head from 'next/head';
import { message, Layout } from 'antd';
import { orderService } from '@services/index';
import OrderTableList from '@components/order/table-list';
import { connect } from 'react-redux';
import { IUIConfig, IUser } from 'src/interfaces';

interface IProps {
  ui: IUIConfig;
  user: IUser;
}

class PerformerOrderPage extends PureComponent<IProps> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {} as any,
    searching: true,
    list: [] as any,
    limit: 10,
    filter: {} as any,
    sortBy: 'updatedAt',
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
      sortBy: sorter.field || 'updatedAt',
      // eslint-disable-next-line no-nested-ternary
      sort: sorter.order
        ? sorter.order === 'descend'
          ? 'desc'
          : 'asc'
        : 'desc'
    });
    this.search(pager.current);
  };

  async search(page = 1) {
    try {
      const {
        filter, limit, sort, sortBy, pagination
      } = this.state;
      await this.setState({ searching: true });
      const resp = await orderService.detailsSearch({
        ...filter,
        limit,
        offset: (page - 1) * limit,
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
      this.setState({ searching: false });
    }
  }

  render() {
    const { list, searching, pagination } = this.state;
    const { ui } = this.props;

    return (
      <Layout>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | My Orders
          </title>
        </Head>
        <div className="main-container">
          <div className="page-heading">
            <span className="box">My orders </span>
          </div>
          <div style={{ marginBottom: '20px' }} />
          <OrderTableList
            dataSource={list}
            rowKey="_id"
            loading={searching}
            pagination={{ ...pagination, showSizeChanger: false }}
            onChange={this.handleTableChange.bind(this)}
          />
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  user: { ...state.user.current }
});
export default connect(mapStates)(PerformerOrderPage);
