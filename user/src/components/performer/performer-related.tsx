import Link from 'next/link';
import { useEffect, useState } from 'react';
import { message } from 'antd';
import { IPerformer } from 'src/interfaces';
import { performerService } from '@services/performer.service';
import './performer-related.less';
import { truncate } from 'lodash';

interface IProps {
  performerId: string;
}

export function RelatedProfiles({ performerId }: IProps) {
  const [performers, setPerformers] = useState([]);

  const loadRelated = async () => {
    try {
      const { data } = await performerService.related(performerId);
      const fiveItem = data.slice(0, 5);
      setPerformers(fiveItem);
    } catch {
      message.error('Error occured, please try again later');
    }
  };

  useEffect(() => {
    if (performerId) loadRelated();
  }, [performerId]);

  return (
    <>
      <div className="related">
        <h3 className="title">You may also like</h3>
        {performers?.map((performer: IPerformer) => (
          <div key={performer._id} className="profile">
            <Link
              href={{
                pathname: '/model/profile',
                query: { id: performer.username }
              }}
              as={`/model/${performer.username}`}
            >
              <a>
                <img
                  src={performer.avatar || '/no-avatar.png'}
                  alt={performer.username}
                />
              </a>
            </Link>
            <div className="info">
              <div className="name">{performer.username}</div>
              {performer.country && <div className="country">{performer.country}</div>}
              {performer.aboutMe && (
              <div className="aboutMe">
                {truncate(performer.aboutMe, {
                  length: 100
                })}
              </div>
              )}
              <div className="button">
                <Link
                  href={{
                    pathname: '/model/profile',
                    query: { id: performer.username }
                  }}
                  as={`/model/${performer.username}`}
                >
                  <a className="view-profile">VIEW PROFILE</a>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
