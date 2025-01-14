/* eslint-disable no-nested-ternary */
import { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'react-redux';
import { IUIConfig } from 'src/interfaces';
import './loader.less';

interface IProps {
  ui: IUIConfig
}

class Loader extends PureComponent<IProps> {
  render() {
    const { ui } = this.props;
    return (
      <div className="loading-screen">
        {ui.logo ? <img alt="loading-ico" src={ui.logo} /> : ui.siteName ? <span>{ui.siteName}</span> : <Spin />}
      </div>
    );
  }
}
const mapStatesToProps = (state) => ({
  ui: { ...state.ui }
});
export default connect(mapStatesToProps)(Loader) as any;
