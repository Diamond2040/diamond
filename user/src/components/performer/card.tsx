import { IPerformer } from 'src/interfaces';
import Link from 'next/link';
import './performer.less';

interface IProps {
  performer: IPerformer;
}

export default function PerformerCard({ performer }: IProps) {
  return (
    <div className="model-card">
      {performer?.username && (
        <div className="absolute-items">
          {performer?.vip && <span className="vip" />}
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
              alt={performer?.name || performer?.username || ''}
            />
          </a>
        </Link>
        <div className="box-content">
          <h3 className="title">
            <Link
              href={{
                pathname: '/model/profile',
                query: { id: performer?.username }
              }}
              as={`/model/${performer?.username}`}
            >
              <a>{performer?.name}</a>
            </Link>
          </h3>
        </div>
      </div>
    </div>
  );
}
