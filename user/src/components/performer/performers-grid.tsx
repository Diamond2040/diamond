import { Spin } from 'antd';
import Masonry from 'react-masonry-css';
import { IPerformer } from 'src/interfaces';
import PerformerCard from './card';
import './performer-grid.less';

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
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <Masonry
      breakpointCols={breakpointColumns}
      className="performer-grid"
      columnClassName="performer-grid-column"
    >
      {performers?.map((p: any) => (
        <PerformerCard performer={p} key={p._id} />
      ))}
    </Masonry>
  );
};
