import { Review } from 'src/interfaces';
import { Divider } from 'antd';

import ReviewCard from './ReviewCard';
import './ReviewItemList.less';

interface ReviewItemListProps {
  items: Review[];
}

export const ReviewItemList = ({ items }: ReviewItemListProps) => {
  if (!items?.length) return null;

  return (
    <div className="review-item-list">
      {items.map((review) => (
        <>
          <Divider />
          <ReviewCard key={review._id} {...review} />
        </>
      ))}
    </div>
  );
};
