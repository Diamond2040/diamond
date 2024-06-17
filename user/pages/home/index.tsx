/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import {
  Layout, Button
} from 'antd';
import { connect } from 'react-redux';
import Head from 'next/head';
import { PerformersGrid } from '@components/performer';
import { Banner } from '@components/common';
import { getBanners } from '@redux/banner/actions';
import { performerService, postService } from '@services/index';
import { IUIConfig } from '@interfaces/index';
import './index.less';
import storeHolder from '@lib/storeHolder';
import SearchFilter from '@components/filter/search-filter';

interface IProps {
  ui: IUIConfig;
  banners: any;
  getBanners: Function;
  home: any;
  settings: any;
}

class HomePage extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  static async getInitialProps() {
    // postService.findById();
    const store = storeHolder.getStore();
    const { settings } = store.getState() as any;
    if (!settings.homeContentPageId) {
      return {
        settings
      };
    }

    const resp = await postService.findById(settings.homeContentPageId);
    return {
      home: {
        content: resp.data?.content,
        title: resp.data?.title,
        image: resp.data?.image
      },
      settings
    };
  }

  state = {
    fetching: true,
    performers: [],
    openFilter: false
  };

  componentDidMount() {
    const { getBanners: getBannersHandler } = this.props;
    getBannersHandler({ limit: 15, position: 'homeTop,homeBottom' });
    this.getInitialData();
  }

  async getInitialData() {
    try {
      await this.setState({ fetching: true });
      const performers = await performerService.search({
        limit: 200,
        sort: 'lastOnline'
      });
      this.setState({
        performers: performers.data.data,
        fetching: false
      });
    } catch {
      this.setState({ fetching: false });
    }
  }

  render() {
    const { banners = [], ui, settings } = this.props;
    const { performers, fetching, openFilter } = this.state;
    const topBanners = banners?.data.filter((b) => b.position === 'homeTop');
    const bottomBanners = banners?.data.filter((b) => b.position === 'homeBottom');
    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Home
          </title>
          <meta name="keywords" content={settings?.metaKeywords} />
          <meta name="description" content={settings?.metaDescription} />
          {/* OG tags */}
          <meta property="og:title" content={settings?.siteName} key="title" />
          <meta property="og:image" content={settings?.logoUrl} />
          <meta property="og:keywords" content={settings?.metaKeywords} />
          <meta property="og:description" content={settings?.metaDescription} />
        </Head>
        <Layout className="home-page-layout">
          <div className="home-page">
            <div>
              <div className="main-container">
                {topBanners && topBanners.length > 0 && (
                  <div className="banner">
                    <Banner banners={topBanners} autoplay arrows={false} dots />
                  </div>
                )}
                <div className="filter-switch">
                  <Button
                    className="btn btn-outline-primary"
                    onClick={() => this.setState({
                      openFilter: !openFilter
                    })}
                  >
                    Filter
                  </Button>
                </div>
                {openFilter && <SearchFilter />}
                <PerformersGrid performers={performers} loading={fetching} />

                {bottomBanners && bottomBanners.length > 0 && (
                  <div className="banner">
                    <Banner banners={bottomBanners} autoplay arrows={false} dots />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Layout>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  banners: state.banner.listBanners.data
});

const mapDispatch = { getBanners };
export default connect(mapStates, mapDispatch)(HomePage);
