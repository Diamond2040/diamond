import React, { PureComponent } from 'react';
import {
  Layout
} from 'antd';
import { connect } from 'react-redux';
import { Banner } from '@components/common';
import { getBanners } from '@redux/banner/actions';
import './index.less';

interface IProps {
  banners: any;
  getBanners: Function;
}

class RightSideBanner extends PureComponent<IProps> {
  state = {
  };

  componentDidMount() {
    const { getBanners: getBannersHandler } = this.props;
    getBannersHandler({ limit: 5, position: 'rightSidebar' });
  }

  render() {
    const { banners = [] } = this.props;
    const topBanners = banners
      && banners.data.length > 0
      && banners.data.filter((b) => b.position === 'rightSidebar');
    return (
      <Layout>
        <div className="main-container">
          {topBanners && topBanners.length > 0 && (
          <div className="banner">
            <Banner banners={topBanners} autoplay arrows={false} dots />
          </div>
          )}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  banners: state.banner.listBanners.data
});

const mapDispatch = { getBanners };
export default connect(mapStates, mapDispatch)(RightSideBanner);
