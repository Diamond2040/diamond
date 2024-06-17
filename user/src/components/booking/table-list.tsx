import {
  Select, Table, message, Space
} from 'antd';
import { InfoCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { IOrder, IUser } from 'src/interfaces';
import { formatDate } from '@lib/date';
import { scheduleService } from '@services/schedule.service';
import { useState } from 'react';
import Router from 'next/router';

interface IProps {
  dataSource: IOrder[];
  pagination: {};
  rowKey: string;
  loading: boolean;
  onChange: Function;
  user: IUser;
  onDelete?: Function;
  onForceRender: Function;
}

const BookingTableList = ({
  dataSource,
  pagination,
  rowKey,
  loading,
  onChange,
  onDelete,
  user,
  onForceRender
}: IProps) => {
  const [requesting, setRequesting] = useState(false);
  const acceptBooking = async (id) => {
    if (!window.confirm('Confirm this booking?')) {
      return;
    }
    try {
      setRequesting(true);
      await scheduleService.AcceptedBooking(id);
      message.success('Booking is accepted');
      onForceRender();
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setRequesting(false);
    }
  };

  const rejectBooking = async (id) => {
    if (!window.confirm('Reject this reservation?')) {
      return;
    }
    try {
      setRequesting(true);
      await scheduleService.rejectBooking(id);
      onForceRender();
      message.success('Booking is rejected');
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      setRequesting(false);
    }
  };

  const columns = [
    {
      title: user?.roles.includes('performer') ? 'User' : 'Escort',
      key: 'name',
      dataIndex: user?.roles.includes('performer')
        ? 'sourceInfo'
        : 'targetInfo',
      render: (data: IUser) => data?.name || data?.username
    },
    {
      title: 'Start At',
      key: 'startAt',
      dataIndex: 'startAt',
      render: (startAt: Date) => formatDate(startAt, 'DD/MM/YYYY HH:mm')
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      key: 'duration'
    },
    {
      title: 'Created At',
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (createdAt: Date) => formatDate(createdAt, 'DD/MM/YYYY HH:mm')
    },
    // {
    //   title: '',
    //   dataIndex: '',
    //   render() {
    //     return (
    //       <Space>
    //         <Button
    //           className="primary"
    //           size="small"
    //           onClick={() => handleRouterPush()}
    //         >
    //           CHAT
    //         </Button>
    //       </Space>
    //     );
    //   }
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      render(status: string, record: any) {
        return user?.roles.includes('performer') ? (
          <Select
            value={status}
            onSelect={(val) => {
              if (val === 'accepted') acceptBooking(record._id);
              if (val === 'reject') rejectBooking(record._id);
            }}
          >
            <Select.Option value="accepted">Accepted</Select.Option>
            <Select.Option value="reject">Rejected</Select.Option>
            <Select.Option value="created" disabled>
              Created
            </Select.Option>
            <Select.Option value="pending" disabled>
              Pending
            </Select.Option>
            <Select.Option value="paid" disabled>
              Paid
            </Select.Option>
          </Select>
        ) : (
          <strong>{status}</strong>
        );
      }
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render(id: string) {
        return (
          <Space>
            <InfoCircleOutlined
              className="link"
              onClick={() => {
                Router.push({
                  pathname: user.roles?.includes('performer')
                    ? '/model/bookings/detail'
                    : '/user/bookings/detail',
                  query: { id }
                });
              }}
            />
            {onDelete && (
              <DeleteOutlined className="link" onClick={() => onDelete(id)} />
            )}
          </Space>
        );
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
        loading={loading || requesting}
        onChange={onChange.bind(this)}
      />
    </div>
  );
};
BookingTableList.defaultProps = {
  onDelete: null
};
export default BookingTableList;
