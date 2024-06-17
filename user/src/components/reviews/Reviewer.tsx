import { useEffect, useState } from 'react';
import { IPerformer } from 'src/interfaces';
import { ReviewCreateForm, ReviewItemList } from '@components/reviews';
import { message, Pagination, Rate } from 'antd';
import { getResponseError } from '@lib/utils';
import './Reviewer.less';
import { reviewService } from 'src/services';

interface IProps {
  sourceId: string;
  source: string;
  performer: IPerformer;
}

function Reviewer({
  sourceId = null,
  source = 'performer',
  performer
}: IProps) {
  const limit = 12;
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSource, setDataSource] = useState({
    total: 0,
    data: []
  });

  const getDataSource = async (page = 1) => {
    try {
      setLoading(true);
      const resp = await reviewService.search({
        sourceId,
        source,
        limit,
        offset: (page - 1) * limit
      });
      setDataSource(resp.data);
      setCurrentPage(page);
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    } finally {
      setLoading(false);
    }
  };

  const onRate = async (data) => {
    try {
      const newData = [
        data,
        ...dataSource.data
      ];
      setDataSource({
        ...dataSource,
        data: newData
      });
      message.success('Thank you for your rating!');
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    }
  };

  useEffect(() => {
    if (performer) getDataSource();
  }, [performer]);

  return (
    <>
      <h3 className="title-review">REVIEWS</h3>
      {performer?.stats?.totalRates > 0 && (
      <>
        <Rate value={Math.round(performer?.stats?.numRates / performer.stats.totalRates || 0)} disabled />
        {' '}
        <span className="avgRates">{(performer?.stats?.numRates / performer.stats.totalRates || 0)}</span>
        {' '}
        (Out of
        {' '}
        {performer.stats.totalRates}
        {' '}
        reviews)
      </>
      )}
      <ReviewItemList items={dataSource.data} />
      <Pagination
        hideOnSinglePage
        current={currentPage}
        pageSize={limit}
        total={dataSource.total}
        onChange={getDataSource}
        className="text-center"
      />
      <ReviewCreateForm
        loading={loading}
        source={source}
        sourceId={sourceId}
        onFinish={onRate}
      />
    </>
  );
}

export default Reviewer;
