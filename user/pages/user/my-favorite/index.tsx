/* eslint-disable react/no-danger */
import React, { PureComponent } from 'react';
import {
  Layout, Row, Col, message
} from 'antd';
import { connect } from 'react-redux';
import { getBanners } from '@redux/banner/actions';
import { IUIConfig } from '@interfaces/index';
import './index.less';
import { favoriteService } from '@services/favorite-service';
import { PerformersGrid } from '@components/user/performer-grid';
import RightSideBanner from '@components/common/right-side-bar';

interface IProps {
  ui: IUIConfig;
  banners: any;
  getBanners: Function;
  home: any;
  settings: any;
}

class FavoritePage extends PureComponent<IProps> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  state = {
    fetching: true,
    favoriteList: []
  };

  componentDidMount() {
    this.favoriteList();
  }

  async favoriteList() {
    try {
      await this.setState({ fetching: true });
      const resp = await favoriteService.search({
        limit: 1000,
        sort: 'desc',
        sortBy: 'score'
      });
      this.setState({
        favoriteList: resp.data.data
      });
    } catch {
      message.error('Error an occurent, please try again later');
    } finally {
      this.setState({ fetching: false });
    }
  }

  render() {
    const { favoriteList, fetching } = this.state;
    return (
      <Layout>
        <Row gutter={24}>
          <Col lg={24} md={24} sm={24} xs={24}>
            <div className="related">
              <h3 className="title-my-favorite">MY FAVORITES</h3>
              <PerformersGrid performers={favoriteList} loading={fetching} />
            </div>
          </Col>
        </Row>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui,
  banners: state.banner.listBanners.data
});

const mapDispatch = { getBanners };
export default connect(mapStates, mapDispatch)(FavoritePage);
