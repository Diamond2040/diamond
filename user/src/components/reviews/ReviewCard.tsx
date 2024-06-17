import React from 'react';
import { Rate } from 'antd';
import { Review } from 'src/interfaces';
import './ReviewCard.less';
import { formatDate } from '@lib/date';

const ReviewCard = React.memo(({
  reviewer, rating, comment, createdAt
}: Review) => (
  <div className="review-card">
    <img src={reviewer?.avatar || '/no-avatar.png'} alt="" />
    {' '}
    <span className="username">
      {reviewer?.username || 'N/A'}
    </span>
    {' '}
    <Rate value={rating} disabled />
    <div className="r-description">{comment}</div>
    <div className="createdAt">{formatDate(createdAt)}</div>
  </div>
));

ReviewCard.displayName = 'ReviewCard';
export default ReviewCard;
