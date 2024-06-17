import Table, { TableProps } from 'antd/lib/table';
import { Review } from 'src/interfaces';

export const ReviewTableList = (props: TableProps<Review>) => {
  const columns = [
    {
      title: 'Reviewer',
      key: 'reviewer',
      render: (record: Review) => record?.reviewer?.username || 'N/A'
    },
    {
      title: 'Star',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true
    },
    {
      title: 'Updated at',
      dataIndex: 'updatedAt',
      key: 'updatedAt'
    }
  ];
  return (
    <Table
      {...props}
      columns={columns}
      rowKey="_id"
      expandable={{
        rowExpandable: (record) => (record.comment && record.comment.length > 0),
        expandedRowRender: (record) => <p>{record.comment}</p>
      }}
    />
  );
};
