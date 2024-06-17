import { IPerformer } from 'src/interfaces';
import Link from 'next/link';
import { Button, message } from 'antd';
import { favoriteService } from '@services/favorite-service';
import { useState } from 'react';
import Router from 'next/router';
import './my-favorite-list.less';

interface IProps {
  performer: IPerformer;
}

export default function FavoritePerformerCard({ performer }: IProps) {
  const [submiting, setSubmiting] = useState(false);
  const removeFavorite = async () => {
    const data = ({
      objectType: 'performer',
      objectId: performer?._id,
      action: 'favourite'
    });
    try {
      setSubmiting(true);
      await favoriteService.delete(data);
      message.success('Model has been removed from favorites!');
      Router.reload();
    } catch (e) {
      message.error('Error an occurent, please try again later');
      setSubmiting(false);
    }
  };

  return (
    <div className="model-card">
      {performer?.username && (
        <div className="absolute-items">
          {performer?.vip && <span className="vip left-0" />}
          {performer?.verified && (
            <div className="verified">
              <span>verified</span>
            </div>
          )}
        </div>
      )}
      <div className="box">
        <Link
          href={{
            pathname: '/model/profile',
            query: { id: performer?.username }
          }}
          as={`/model/${performer?.username}`}
        >
          <a>
            <img
              src={performer?.avatar || '/no-avatar.png'}
              alt={performer?.username || ''}
            />
          </a>
        </Link>
        <div className="box-content box-username">
          <Link
            href={{
              pathname: '/model/profile',
              query: { id: performer?.username }
            }}
            as={`/model/${performer?.username}`}
          >
            <a>{performer?.username}</a>
          </Link>
        </div>
        <div className="box-below">
          {!submiting
          && (
          <Button
            className="btn-remove-favorite"
            onClick={() => removeFavorite()}
          >
            Remove
          </Button>
          )}
        </div>
      </div>
    </div>
  );
}
