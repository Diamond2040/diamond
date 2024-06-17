import {
  Table, Tag, Button
} from 'antd';
import { StopOutlined } from '@ant-design/icons';
import { ISubscription } from 'src/interfaces';
import { formatDate, formatDateNoTime } from '@lib/date';

interface IProps {
  dataSource: ISubscription[];
  pagination: {};
  rowKey: string;
  onChange(): Function;
  loading: boolean;
  onCancelSubscriber: Function;
}

export const TableListSubscription = ({
  dataSource,
  pagination,
  rowKey,
  onChange,
  loading,
  onCancelSubscriber
}: IProps) => {
  const columns = [
    {
      title: 'Performer',
      dataIndex: 'userInfo',
      render(data, records) {
        return (
          <span>
            {`${records?.userInfo?.name}`}
            <br />
            {`@${records?.userInfo.username}`}
          </span>
        );
      }
    },
    {
      title: 'Type',
      dataIndex: 'subscriptionType',
      render(subscriptionType: string) {
        switch (subscriptionType) {
          case 'recurring':
            return <Tag color="orange">Recurring</Tag>;
          case 'single':
            return <Tag color="purple">Non-recurring</Tag>;
          case 'system':
            return <Tag>System</Tag>;
          default: return <Tag color="orange">{subscriptionType}</Tag>;
        }
      }
    },
    {
      title: 'Membership type',
      dataIndex: 'membershipType',
      render(membershipType: string) {
        switch (membershipType) {
          case 'basic':
            return <Tag color="orange">Basic</Tag>;
          case 'premium':
            return <Tag color="purple">Premium</Tag>;
          default:
            return <Tag color="orange">{membershipType}</Tag>;
        }
      }
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiredAt',
      render(date: Date) {
        return <span>{formatDateNoTime(date)}</span>;
      }
    },
    {
      title: 'Start Reccuring Date',
      dataIndex: 'startRecurringDate',
      render(data, records) {
        return <span>{records.subscriptionType === 'recurring' ? formatDateNoTime(records.startRecurringDate) : 'N/A'}</span>;
      }
    },
    {
      title: 'Next Reccuring Date',
      dataIndex: 'nextRecurringDate',
      render(data, records) {
        return <span>{records.subscriptionType === 'recurring' ? formatDateNoTime(records.nextRecurringDate) : 'N/A'}</span>;
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string) {
        switch (status) {
          case 'active':
            return <Tag color="green">Active</Tag>;
          case 'deactivated':
            return <Tag color="red">Deactivated</Tag>;
          default: return <Tag color="red">Deactivated</Tag>;
        }
      }
    },
    {
      title: 'Last Update',
      dataIndex: 'updatedAt',
      sorter: true,
      render(date: Date) {
        return <span>{formatDate(date)}</span>;
      }
    },
    {
      title: 'Actions',
      dataIndex: 'status',
      render(data, records) {
        return (
          <Button disabled={records?.status !== 'active'} type="link" onClick={() => onCancelSubscriber(records._id)}>
            <StopOutlined />
            {' '}
            Cancel subscription
          </Button>
        );
      }
    }
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={rowKey}
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
};
