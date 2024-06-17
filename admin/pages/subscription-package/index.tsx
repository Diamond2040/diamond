import Head from 'next/head';
import { message, Layout } from 'antd';
import Page from '@components/common/layout/page';
import { PureComponent } from 'react';
import { SearchFilter } from '@components/common/search-filter';
import { subscriptionPackageService } from 'src/services';
import { ISubscriptionPackage } from 'src/interfaces';
import { SubscriptionPackageTable } from '@components/subscription-package/table-list';
import { getResponseError } from '@lib/utils';
import { BreadcrumbComponent } from '@components/common';

interface IProps {}

interface IStates {
  loading: boolean;
  limit: number;
  offset: number;
  total: number;
  packageList: ISubscriptionPackage[];
  filter: any;
}

class SubscriptionPackagePage extends PureComponent<IProps, IStates> {
  state = {
    limit: 10,
    offset: 0,
    total: 0,
    loading: false,
    packageList: [],
    filter: {}
  };

  componentDidMount() {
    this.getData();
  }

  async handleTableChange(data) {
    await this.setState({ offset: data.current - 1 });
    this.getData();
  }

  async handleDelete(id: string) {
    try {
      const { packageList } = this.state;
      await subscriptionPackageService.delete(id);
      this.setState({ packageList: packageList.filter((packageId) => packageId._id !== id) });
      message.success('Deleted successfully');
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    }
  }

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.getData();
  }

  async getData() {
    try {
      const { offset, limit, filter } = this.state;
      await this.setState({ loading: true });
      const resp = await subscriptionPackageService.list({
        ...filter,
        limit,
        offset: offset * limit,
        sortBy: 'ordering',
        sort: 'asc'
      });
      this.setState({ packageList: resp.data.data, total: resp.data.total, loading: false });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
      this.setState({ loading: false });
    }
  }

  render() {
    const { packageList, loading, total } = this.state;
    const statuses = [
      {
        key: '',
        text: 'All status'
      },
      {
        key: 'active',
        text: 'Active'
      },
      {
        key: 'inactive',
        text: 'Inactive'
      }
    ];
    return (
      <Layout>
        <Head>
          <title>Subscription Packages</title>
        </Head>
        <div style={{ marginBottom: '16px' }}>
          <BreadcrumbComponent breadcrumbs={[{ title: 'Subscription Packages', href: '/subscription-package' }, { title: 'New subscription package' }]} />
        </div>
        <Page>
          <SearchFilter keyword statuses={statuses} onSubmit={this.handleFilter.bind(this)} />
          <SubscriptionPackageTable
            dataSource={packageList}
            rowKey="_id"
            total={total}
            deletePackage={this.handleDelete.bind(this)}
            loading={loading}
            onChange={this.handleTableChange.bind(this)}
          />
        </Page>
      </Layout>
    );
  }
}

export default SubscriptionPackagePage;
