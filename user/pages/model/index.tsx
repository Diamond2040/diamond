import { PureComponent } from 'react';
import {
  Row, Col, Layout, Pagination, Spin, message
} from 'antd';
import { connect } from 'react-redux';
import PerformerCard from '@components/performer/card';
import { StarOutlined } from '@ant-design/icons';
import Head from 'next/head';
import { PerformerAdvancedFilter } from '@components/common';
import { IUIConfig } from 'src/interfaces/';
import '@components/performer/performer.less';
import { performerService } from '@services/performer.service';

interface IProps {
  ui: IUIConfig;
}

class Performers extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  state = {
    offset: 0,
    limit: 12,
    filter: { } as any,
    sort: 'desc',
    sortBy: 'popular',
    performers: [],
    total: 0,
    fetching: true
  };

  componentDidMount() {
    this.getPerformers();
  }

  // eslint-disable-next-line react/sort-comp
  async getPerformers() {
    const {
      limit, offset, filter, sort, sortBy
    } = this.state;
    try {
      await this.setState({ fetching: true });
      const resp = await performerService.search({
        limit,
        offset: offset * limit,
        sort,
        sortBy,
        ...filter
      });
      this.setState({ performers: resp.data.data, total: resp.data.total, fetching: false });
    } catch {
      message.error('Error occured, please try again later');
      this.setState({ fetching: false });
    }
  }

  async handleFilter(values: any) {
    const { filter } = this.state;
    await this.setState({ offset: 0, filter: { ...filter, ...values } });
    this.getPerformers();
  }

  async handleSort(values: any) {
    await this.setState({ offset: 0, sort: values.key });
    this.getPerformers();
  }

  async pageChanged(page: number) {
    await this.setState({ offset: page - 1 });
    this.getPerformers();
  }

  render() {
    const {
      ui
    } = this.props;
    const {
      limit, offset, performers, total, fetching
    } = this.state;

    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Models
          </title>
        </Head>
        <Layout>
          <div className="main-container">
            <div className="page-heading">
              <span className="box">
                <StarOutlined />
                {' '}
                Models
              </span>
            </div>
            <div className="md-below-heading">
              <PerformerAdvancedFilter
                onSubmit={this.handleFilter.bind(this)}
                countries={ui?.countries || []}
              />
            </div>
            <div className="main-background">
              <Row>
                {performers.length > 0
                  && !fetching
                  && performers.map((p: any) => (
                    <Col xs={12} sm={12} md={6} lg={6} key={p._id}>
                      <PerformerCard performer={p} />
                    </Col>
                  ))}
              </Row>
              {!total && !fetching && <p className="text-center">No profile was found.</p>}
              {fetching && <div className="text-center"><Spin /></div>}
              {total && total > limit ? (
                <div className="paging">
                  <Pagination
                    current={offset + 1}
                    total={total}
                    pageSize={limit}
                    onChange={this.pageChanged.bind(this)}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui }
});

const mapDispatch = { };
export default connect(mapStates, mapDispatch)(Performers);
