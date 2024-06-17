import React from 'react';
import { Table, Tag } from 'antd';
import { ITransaction } from 'src/interfaces';
import { formatDate } from '@lib/date';

interface IProps {
  dataSource: ITransaction[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
}

const PaymentTableList = ({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange
}: IProps) => {
  const columns = [
    {
      title: 'ID',
      sorter: true,
      dataIndex: 'orderNumber'
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render(type: string) {
        switch (type) {
          case 'subscription_package': return <Tag color="orange">Membership Plan</Tag>;
          case 'product': return <Tag color="blue">Product</Tag>;
          case 'sale_video': return <Tag color="pink">Video</Tag>;
          case 'sale_gallery': return <Tag color="violet">Gallery</Tag>;
          default: return <Tag color="orange">{type}</Tag>;
        }
      }
    },
    {
      title: 'Description',
      render(data, record) {
        return record.details?.map((p) => (
          <p key={p._id}>
            <span>{p.name}</span>
          </p>
        ));
      }
    },
    {
      title: 'Original price',
      dataIndex: 'originalPrice',
      sorter: true,
      render(data, record) {
        return (
          <span>
            $
            {(record.originalPrice && record.originalPrice.toFixed(2))
              || record.totalPrice.toFixed(2)}
          </span>
        );
      }
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      sorter: true,
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
      title: 'Date',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    }
  ];
  return (
    <div className="table-responsive">
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={pagination}
        rowKey={rowKey}
        loading={loading}
        onChange={onChange.bind(this)}
      />
    </div>
  );
};
export default PaymentTableList;
