import { Booking } from '@interfaces/booking';
import { formatDate } from '@lib/date';
import {
  Menu, Card, Avatar, Button, Dropdown, Badge
} from 'antd';
import { BellOutlined } from '@ant-design/icons';

interface IProps {
  dataSource: Booking[];
  onMenuItemClick: any;
  onItemBtnClick: any;
  dismiss: any;
  overlayClassName: string;
}

export const BookingNotificationMenuDropDown = ({
  dataSource,
  onMenuItemClick,
  onItemBtnClick,
  dismiss,
  overlayClassName
}: IProps) => (
  <Dropdown
    overlayClassName={overlayClassName}
    overlay={(
      <Menu style={{ maxHeight: 400, overflow: 'scroll' }}>
        {dataSource.length > 0 ? (
          <>
            {dataSource.map((data) => (
              <Menu.Item
                key={data._id}
                onClick={() => onMenuItemClick(data._id)}
              >
                <Card bordered={false} hoverable={false}>
                  <Card.Meta
                    style={{ borderBottom: '0.5px solid #ccc' }}
                    avatar={(
                      <Avatar
                        style={{
                          border: '2px solid #eebd22',
                          width: 40,
                          height: 40,
                          marginTop: 5
                        }}
                        src={data.dataInfo?.avatar || '/no-avatar.png'}
                      />
                    )}
                    description={(
                      <>
                        <div
                          style={{
                            float: 'left',
                            height: 100,
                            width: 175,
                            lineHeight: '30px',
                            padding: '0 5px'
                          }}
                        >
                          <span className="booking-text">Booking: </span>
                          <span className="booking-text username">
                            {data.dataInfo?.username}
                          </span>
                          <br />
                          {data.status}
                          <br />
                          <div className="format-date">
                            {formatDate(data?.createdAt)}
                          </div>
                        </div>
                        <Button
                          className="primary"
                          size="small"
                          style={{ zIndex: 2 }}
                          onClick={() => onItemBtnClick(data._id)}
                        >
                          CHAT
                        </Button>
                      </>
                    )}
                  />
                </Card>
              </Menu.Item>
            ))}
            <Menu.Item>
              <Button
                className="primary"
                id="DismissAllButton"
                onClick={dismiss}
              >
                Dismiss All
              </Button>
            </Menu.Item>
          </>
        ) : (
          <Menu.Item>There are no new notification.</Menu.Item>
        )}
      </Menu>
    )}
  >
    <span>
      <Badge count={dataSource.length}>
        <BellOutlined />
      </Badge>
    </span>
  </Dropdown>
);
