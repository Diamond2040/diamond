import React, { PureComponent } from 'react';
import { Layout, Pagination } from 'antd';
import { connect } from 'react-redux';
import Head from 'next/head';
import Router from 'next/router';
import {
  SearchOutlined
} from '@ant-design/icons';
import { PerformersGrid } from '@components/performer';
import { performerService, categoriesService } from '@services/index';
import { IUIConfig } from '@interfaces/index';

import './index.less';

interface IProps {
  ui: IUIConfig;
  id: string;
  category: any;
}

class CategoryPage extends PureComponent<IProps> {
  static authenticate: boolean = false;

  static noredirect: boolean = true;

  state = {
    fetching: true,
    performers: [],
    limit: 12,
    total: 0,
    page: 1
  };

  static async getInitialProps({ ctx }) {
    const { id = '' } = ctx.query;
    // if donthave id -> redirect 404 page
    // load category detailsSearch
    const category = await categoriesService.details(id);
    return {
      id,
      category: category?.data
    };
  }

  componentDidMount() {
    this.search();
  }

  search = async (page = 1) => {
    try {
      const { category } = this.props;
      const { limit } = this.state;
      const offset = (page - 1) * limit;
      await this.setState({
        fetching: true,
        page
      });
      const resp = await performerService.search({
        categoryId: category?._id || '',
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
  }

  onEnter = (q) => {
    Router.replace({
      pathname: '/category',
      query: { q }
    });

    this.search(1);
  }

  render() {
    const {
      performers, fetching, limit, total, page
    } = this.state;
    const { ui, id, category } = this.props;
    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            |
            {' '}
            {category?.name}
          </title>
        </Head>
        <Layout>
          <div className="search-container">
            <div className="main-container">
              <div className="page-heading">
                <span className="box">
                  <SearchOutlined />
                  {' '}
                  {id && `'${id}'`}
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
                    onChange={(p) => this.search(p)}
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

export default connect(mapStates)(CategoryPage);
