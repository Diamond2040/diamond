import { ISubscriptionPackage } from '@interfaces/subscription';
import {
  Card, Button
} from 'antd';
import './index.less';

interface IProps {
  item: ISubscriptionPackage;
  onSelect: Function;
  submiting?: boolean;
  isActive?: boolean;
}

export const PackageGridCard = ({
  item, onSelect, submiting = false, isActive = false
}: IProps) => (
  <Card className={!isActive ? 'pk-card' : 'pk-card active'}>
    <div className="pk-top">
      <h2 className="pk-name">{item.name || 'N/A'}</h2>
      <div className="pk-price">
        <span>
          $
          {(item.price || 0).toFixed(2)}
          /
        </span>
        <span className="sub-price">
          {item.initialPeriod}
          {' '}
          days
        </span>
      </div>
    </div>
    <div className="pk-description">
      {item.description}
    </div>
    {item.recurringPeriod !== 0 ? (
      <p className="recurring-text">
        Recurring in
        {' '}
        {item.recurringPeriod || 1}
        {' '}
        days by $
        {(item.recurringPrice || 0).toFixed(2)}
      </p>
    ) : (
      <p className="recurring-text">
        No recurring
      </p>
    )}
    <div className="pk-btn">
      <Button
        disabled={submiting}
        onClick={() => onSelect()}
      >
        SELECT THIS PACKAGE
      </Button>
    </div>
  </Card>
);

PackageGridCard.defaultProps = ({
  submiting: false,
  isActive: false
});
