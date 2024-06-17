/* eslint-disable no-shadow */
import { Table } from 'antd';
import { IAbuseReport } from 'src/interfaces';
import { formatDate } from 'src/lib/date';
import Link from 'next/link';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { DropdownAction } from '@components/common/dropdown-action';

interface IProps {
  rowKey: string;
  data: IAbuseReport[];
  loading: boolean;
  pagination: {};
  onChange: () => void;
  onDelete: (data) => void;
}

const AbuseReportTable = ({
  rowKey,
  data,
  loading,
  pagination,
  onChange,
  onDelete
}: IProps) => {
  const columns = [
    {
      title: 'Reporter',
      key: 'reporter',
      render(data, record: IAbuseReport) {
        return <span>{record?.sourceInfo?.username || 'N/A'}</span>;
      }
    },
    {
      title: 'Name',
      key: 'name',
      render(data, record: IAbuseReport) {
        return <span>{record?.targetInfo?.name || 'N/A'}</span>;
      }
    },
    {
      title: 'Category',
      key: 'category',
      render(data, record: IAbuseReport) {
        return <span>{record?.category || 'N/A'}</span>;
      }
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Actions',
      fixed: 'right' as 'right',
      sorter: true,
      render(data, record: IAbuseReport) {
        return (
          <DropdownAction
            menuOptions={[
              {
                key: 'view',
                name: 'View',
                children: (
                  <Link
                    href={{
                      pathname: '/abuse-report/detail',
                      query: { id: record._id }
                    }}
                    as={`/abuse-report/detail?id=${record._id}`}
                  >
                    <a>
                      <EyeOutlined />
                      {' '}
                      View
                    </a>
                  </Link>
                )
              },
              {
                key: 'delete',
                name: 'Delete',
                children: (
                  <span>
                    <DeleteOutlined />
                    {' '}
                    Delete
                  </span>
                ),
                onClick: () => onDelete(record)
              }
            ]}
          />
        );
      }
    }
  ];

  return (
    <Table
      columns={columns}
      rowKey={rowKey}
      dataSource={data}
      loading={loading}
      pagination={pagination}
      onChange={onChange}
      scroll={{ x: 700, y: 650 }}
    />
  );
};

export default AbuseReportTable;
