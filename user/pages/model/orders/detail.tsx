import { PureComponent } from 'react';
import {
  Layout, message, Button, Tag, Spin
} from 'antd';
import Head from 'next/head';
import { IOrder, IUIConfig } from 'src/interfaces';
import { orderService } from 'src/services';
import { connect } from 'react-redux';
import Router from 'next/router';
import { formatDate } from '@lib/date';

interface IProps {
  id: string;
  ui: IUIConfig;
}

interface IStates {
  order: IOrder;
  fetching: boolean;
}

class OrderDetailPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      order: null,
      fetching: true
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      const { id } = this.props;
      await this.setState({ fetching: true });
      const order = await orderService.findById(id);
      await this.setState({
        order: order?.data,
        fetching: false
      });
    } catch (e) {
      message.error('Could not find order!');
      Router.back();
    }
  }

  async downloadFile(order) {
    const resp = await orderService.getDownloadLinkDigital(order.productId);
    window.open(resp.data.downloadLink, '_blank');
  }

  render() {
    const { ui } = this.props;
    const { order, fetching } = this.state;
    return (
      <Layout>
        <Head>
          <title>
            {`${ui?.siteName} | Order #${order?.orderNumber || ''}`}
          </title>
        </Head>
        <div className="main-container">
          {!fetching && order && (
          <div>
            <div className="page-heading">
              <span className="box">
                #
                {order?.orderNumber}
              </span>
            </div>
            <div style={{ marginBottom: '10px' }}>
              Product Name:
              {' '}
              {order?.name}
            </div>
            <div style={{ marginBottom: '10px' }}>
              Product Type:
              {' '}
              <Tag color="cyan">{order?.productType}</Tag>
            </div>
            <div style={{ marginBottom: '10px' }}>
              Quantity:
              {' '}
              {order?.quantity}
            </div>
            <div style={{ marginBottom: '10px' }}>
              Unit price:
              {' '}
              $
              {(order?.unitPrice || 0).toFixed(2)}
            </div>
            <div style={{ marginBottom: '10px' }}>
              Discount percentage:
              {' '}
              {(order?.couponInfo?.value || 0) * 100}
              %
            </div>
            <div style={{ marginBottom: '10px' }}>
              Total price:
              {' '}
              $
              {(order?.totalPrice || 0).toFixed(2)}
            </div>
            <div style={{ marginBottom: '10px' }}>
              Date:
              {' '}
              {formatDate(order?.createdAt)}
            </div>
            {/* <div style={{ marginBottom: '10px' }}>
              Paid by:
              {' '}
              <Tag color="magenta">{order?.payBy || 'N/A'}</Tag>
            </div> */}
            {order?.productType === 'physical' && (
            <>
              <div style={{ marginBottom: '10px' }}>
                Delivery Address:
                {' '}
                {order?.deliveryAddress || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                Delivery Address:
                {' '}
                {order?.phoneNumber || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                Delivery Postal Code:
                {' '}
                {order?.postalCode || 'N/A'}
              </div>
              <div style={{ marginBottom: '10px' }}>
                Shipping Code:
                {' '}
                <Tag color="blue">{order?.shippingCode || 'N/A'}</Tag>
              </div>
              <div style={{ marginBottom: '10px' }}>
                Delivery Status:
                {' '}
                <Tag color="magenta" style={{ textTransform: 'capitalize' }}>{order?.deliveryStatus || 'N/A'}</Tag>
              </div>
            </>
            )}
            {order?.productType === 'digital' && (
            <div style={{ marginBottom: '10px' }}>
              Download link:
                {' '}
              <a href="#" onClick={this.downloadFile.bind(this, order)}>Click to download</a>
            </div>
            )}
            <div style={{ marginBottom: '10px' }}>
              <Button danger onClick={() => Router.back()}>
                Back
              </Button>
            </div>
          </div>
          )}
          {fetching && <div className="text-center"><Spin /></div>}
        </div>
      </Layout>
    );
  }
}

const mapStates = (state: any) => ({
  ui: state.ui
});

export default connect(mapStates)(OrderDetailPage);
