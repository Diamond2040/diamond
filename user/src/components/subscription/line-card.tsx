import { ISubscriptionPackage } from '@interfaces/subscription';
import { IUser } from '@interfaces/user';
import {
  Tooltip
} from 'antd';
import Link from 'next/link';
import './index.less';

interface IProps {
  item: ISubscriptionPackage;
  user: IUser;
}

export function SubscriptionPackage({ item, user }: IProps) {
  return (
    <Link href={{ pathname: !user?._id ? '/auth/register' : '/user/upgrade-membership' }} as={!user?._id ? `/auth/register/package?packageId=${item._id}` : `/user/upgrade-membership?packageId=${item._id}`}>
      <div className="line-card-item">
        <div className="item-name">
          <div className="name">{item.name}</div>
          <Tooltip title={item.description}><div className="desc">{item.description}</div></Tooltip>
        </div>
        <div className="item-price">
          <span className="angle-left" />
          <span className="price">
            $
            {(item.price || 0).toFixed(2)}
          </span>
        </div>
      </div>
    </Link>
  );
}
