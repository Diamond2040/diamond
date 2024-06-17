/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import { Layout, Pagination } from 'antd';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router, { Router as RouterEvent, withRouter, NextRouter } from 'next/router';
import {
  SearchOutlined
} from '@ant-design/icons';
import { PerformersGrid } from '@components/performer';
import { performerService } from '@services/index';
import { IUIConfig } from '@interfaces/index';
import './index.less';
import SearchFilter from '@components/filter/search-filter';

interface IProps {
  ui: IUIConfig;
  q: string;
  router: NextRouter;
}

class SearchPage extends PureComponent<IProps> {
  static authenticate: boolean = false;

  static noredirect: boolean = true;

  state = {
    fetching: true,
    performers: [],
    limit: 12,
    total: 0,
    page: 1
  };

  searchTimeout = null;

  componentDidMount() {
    this.searchTimeout = setTimeout(this.searchPerformer, 500);
    RouterEvent.events.on('routeChangeComplete', this.handleRouterChange);
  }

  componentWillUnmount(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    RouterEvent.events.off('routeChangeComplete', this.handleRouterChange);
  }

  handleRouterChange = () => {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(this.searchPerformer, 500);
  }

  searchPerformer = async (page = 1) => {
    try {
      const { query } = Router;
      const { limit } = this.state;
      const offset = (page - 1) * limit;
      await this.setState({
        fetching: true,
        page
      });
      const resp = await performerService.search({
        ...query,
        limit,
        offset,
        sort: 'desc',
        sortBy: 'score'
      });
      const { data, total } = resp.data;
      this.setState({
        performers: data,
        total,
        fetching: false
      });
    } catch {
      this.setState({ fetching: false });
    }
  };

  render() {
    const {
      performers, fetching, limit, total, page
    } = this.state;
    const { ui, q } = this.props;
    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Search result
          </title>
        </Head>
        <Layout>
          <div className="search-container">
            <div className="main-container">
              <div className="search-filter">
                <SearchFilter />
              </div>
              <div className="page-heading">
                <span className="box">
                  <SearchOutlined />
                  {' '}
                  {q && `'${q}'`}
                  {' '}
                  {total}
                  {' '}
                  results
                </span>
              </div>

              <PerformersGrid performers={performers} loading={fetching} />

              {total > limit && (
                <div className="paging">
                  <Pagination
                    current={page}
                    total={total}
                    pageSize={limit}
                    onChange={(p) => this.searchPerformer(p)}
                  />
                </div>
              )}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

export default withRouter(connect(mapStates)(SearchPage));
