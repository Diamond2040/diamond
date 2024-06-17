import { PureComponent } from 'react';
import {
  Table, Tag
} from 'antd';
import { formatDate } from '@lib/date';

interface IProps {
  dataSource: [];
  rowKey: string;
  loading: boolean;
  pagination: {};
  onChange: Function;
}

export class TableListPaymentTransaction extends PureComponent<IProps> {
  render() {
    const columns = [
      {
        title: 'Buyer',
        dataIndex: 'buyer',
        key: 'buyer',
        render(record) {
          return (
            <div>
              {record?.name || record?.username || `${record?.firstName || 'N/'} ${record?.lastName || 'A'}` || 'N/A'}
            </div>
          );
        }
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        render(type: string) {
          switch (type) {
            case 'subscription_package': return <Tag color="orange">Subscription Package</Tag>;
            case 'product': return <Tag color="blue">Product</Tag>;
            case 'sale_video': return <Tag color="pink">Video</Tag>;
            case 'sale_gallery': return <Tag color="violet">Gallery</Tag>;
            default: return <Tag color="orange">{type}</Tag>;
          }
        }
      },
      {
        title: 'Products',
        render(record) {
          return (record?.details || []).map((p) => (
            <p key={p._id}>
              <span style={{ textTransform: 'capitalize' }}>{p.name}</span>
            </p>
          ));
        }
      },
      {
        title: 'Original price',
        dataIndex: 'originalPrice',
        render(originalPrice, record) {
          return (
            <span>
              $
              {(originalPrice || record.totalPrice || 0).toFixed(2)}
            </span>
          );
        }
      },
      {
        title: 'End Price',
        dataIndex: 'totalPrice',
        render(totalPrice, record) {
          return (
            <span>
              $
              {(totalPrice || record.originalPrice || 0).toFixed(2)}
            </span>
          );
        }
      },
      {
        title: 'Payment status',
        dataIndex: 'status',
        render(status: string) {
          switch (status) {
            case 'created':
              return <Tag color="default">Created</Tag>;
            case 'pending':
              return <Tag color="orange">Pending</Tag>;
            case 'paid':
              return <Tag color="green">Paid</Tag>;
            case 'cancel':
              return <Tag color="red">Cancel</Tag>;
            default: return <Tag color="red">{status}</Tag>;
          }
        }
      },
      {
        title: 'Last update',
        dataIndex: 'updatedAt',
        sorter: true,
        render(date: Date) {
          return <span>{formatDate(date)}</span>;
        }
      }
    ];
    const {
      dataSource, rowKey, loading, pagination, onChange
    } = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={rowKey}
        loading={loading}
        pagination={pagination}
        onChange={onChange.bind(this)}
      />
    );
  }
}
