import { message } from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import { BreadcrumbComponent } from '@components/common';
import Page from '@components/common/layout/page';
import { getResponseError } from 'src/lib/utils';
import AbuseReportTable from '@components/abuse-report/table-list';
import { IAbuseReport } from 'src/interfaces';
import { abuseReportService } from 'src/services';

interface IProps {}
interface IStates {
  loading: boolean;
  data: IAbuseReport[];
  pagination: {
    total: number;
    pageSize: number;
  };
  sort: {
    sortBy: string;
    sorter: string;
  };
  offset: number;
  query?: {};
  status?: string;
}

class VideoAbuseReportPage extends PureComponent<IProps, IStates> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      offset: 0,
      pagination: {
        total: 0,
        pageSize: 10
      },
      sort: {
        sortBy: 'createAt',
        sorter: 'desc'
      }
    };
  }

  componentDidMount() {
    this.getList();
  }

  async onHandleTabChange(pgn, filters, sorter) {
    const { sort, pagination } = this.state;
    await this.setState({
      offset: (pgn.current - 1) * pagination.pageSize,
      sort: {
        ...sort,
        sortBy: sorter.field,
        sorter: sorter.order === 'ascend' ? 'asc' : 'desc'
      }
    });
    this.getList();
  }

  async onDelete(record: IAbuseReport) {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const { data } = this.state;
      this.setState({ loading: true });
      await abuseReportService.delete(record._id);
      const index = data.findIndex((d) => d._id === record._id);
      if (index > -1) {
        this.setState({
          data: [...data.slice(0, index), ...data.slice(index + 1)]
        });
      }
    } catch (e) {
      this.showError(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  async getList() {
    const {
      offset, pagination, sort
    } = this.state;
    try {
      this.setState({ loading: true });
      const resp = await abuseReportService.search({
        ...sort,
        offset,
        limit: pagination.pageSize
      });
      await this.setState({
        data: resp.data.data,
        pagination: { ...pagination, total: resp.data.total }
      });
    } catch (e) {
      this.showError(e);
    } finally {
      this.setState({ loading: false });
    }
  }

  async showError(e) {
    const err = await Promise.resolve(e);
    message.error(getResponseError(err));
  }

  render() {
    const { data, loading, pagination } = this.state;
    return (
      <>
        <Head>
          <title>Abuse Report</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Abuse Report' }]} />
        <Page>
          <div style={{ marginBottom: '20px' }} />
          {data ? (
            <AbuseReportTable
              data={data}
              loading={loading}
              rowKey="_id"
              pagination={pagination}
              onChange={this.onHandleTabChange.bind(this)}
              onDelete={this.onDelete.bind(this)}
            />
          ) : (
            <p>No report found.</p>
          )}
        </Page>
      </>
    );
  }
}
export default VideoAbuseReportPage;
