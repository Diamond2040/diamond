import { Spin } from 'antd';
import Masonry from 'react-masonry-css';
import { IPerformer } from 'src/interfaces';
import FavoritePerformerCard from './my-favorite-list';

interface IProps {
  performers: IPerformer[];
  loading: boolean;
}

export const PerformersGrid = ({ performers, loading }: IProps) => {
  if (!loading && !performers.length) {
    return (
      <div className="text-center" style={{ margin: '20px 0' }}>
        No escort was found
      </div>
    );
  }
  if (loading) {
    return (
      <div className="text-center">
        <Spin />
      </div>
    );
  }

  const breakpointColumns = {
    default: 4,
    1100: 4,
    700: 2,
    500: 1
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="performer-grid"
        columnClassName="performer-grid-column"
      >
        {performers.map((p: any) => (
          <FavoritePerformerCard performer={p?.objectInfo} key={p._id} />
        ))}
      </Masonry>
    </>
  );
};
