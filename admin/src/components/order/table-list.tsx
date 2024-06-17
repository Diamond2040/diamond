import { Table, Tag } from 'antd';
import {
  EyeOutlined
} from '@ant-design/icons';
import { IOrder } from 'src/interfaces';
import { formatDate } from '@lib/date';
import Link from 'next/link';

interface IProps {
  dataSource: IOrder[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
}

const OrderTableList = ({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange
}: IProps) => {
  const columns = [
    {
      title: 'Order number',
      dataIndex: 'orderNumber',
      key: 'orderNumber'
    },
    {
      title: 'Buyer',
      dataIndex: 'buyer',
      key: 'buyer',
      render(data, record) {
        return (
          <span>
            {`${record?.buyer?.username || 'N/A'}`}
          </span>
        );
      }
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      render(data, record) {
        return (
          <span>
            $
            {record.totalPrice && record.totalPrice.toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Payment Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'created':
            return <Tag color="default">Created</Tag>;
          case 'pending':
            return <Tag color="#00dcff">Pending</Tag>;
          case 'paid':
            return <Tag color="#00c12c">Paid</Tag>;
          case 'refunded':
            return <Tag color="danger">Refunded</Tag>;
          default: return <Tag color="#FFCF00">{status}</Tag>;
        }
      }
    },
    {
      title: 'Delivery Status',
      dataIndex: 'deliveryStatus',
      render(status: string) {
        switch (status) {
          case 'created':
            return <Tag color="default">Created</Tag>;
          case 'processing':
            return <Tag color="blue">Processing</Tag>;
          case 'shipping':
            return <Tag color="warning">Shipping</Tag>;
          case 'delivered':
            return <Tag color="success">Delivered</Tag>;
          case 'refunded':
            return <Tag color="danger">Refunded</Tag>;
          default: return <Tag>{status}</Tag>;
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
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render(id: string) {
        return <Link href={{ pathname: '/order/detail', query: { id } }}><a><EyeOutlined /></a></Link>;
      }
    }
  ];
  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      pagination={pagination}
      rowKey={rowKey}
      loading={loading}
      onChange={onChange.bind(this)}
    />
  );
};
export default OrderTableList;
