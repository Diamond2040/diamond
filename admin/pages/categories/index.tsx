import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import { SearchFilter } from '@components/common/search-filter';
import { TableListCategory } from '@components/category/table-list';
import { BreadcrumbComponent } from '@components/common';
import { categoryService } from '@services/category.service';
import Router from 'next/router';

interface IProps {
}

class categorys extends PureComponent<IProps> {
  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  state = {
    pagination: {} as any,
    fetching: false,
    limit: 10,
    list: [] as any,
    filter: {} as any,
    sortBy: 'updatedAt'
  };

  async componentDidMount() {
    this.search();
  }

  handleTableChange = (pagination) => {
    const pager = { ...pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager
    });
    this.search(pager.current);
  };

  async handleFilter(values) {
    const { filter } = this.state;
    await this.setState({ filter: { ...filter, ...values } });
    this.search();
  }

  async search(page = 1) {
    const {
      filter, limit, sortBy, pagination
    } = this.state;
    try {
      await this.setState({ fetching: true });
      const resp = await categoryService.search({
        ...filter,
        limit,
        offset: (page - 1) * limit,
        sortBy
      });
      await this.setState({
        list: resp.data.data,
        pagination: {
          ...pagination,
          total: resp.data.total,
          pageSize: limit
        }
      });
    } catch (e) {
      message.error('An error occurred, please try again!');
    } finally {
      await this.setState({ fetching: false });
    }
  }

  async deleteCategory(id: string) {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    try {
      await this.setState({ fetching: true });
      await categoryService.delete(id);
      message.success('Deleted successfully');
      Router.reload();
    } catch (error) {
      message.error(error.message || 'An error occurred, please try again!');
    } finally {
      await this.setState({ fetching: false });
    }
  }

  render() {
    const { list, pagination, fetching } = this.state;
    const statuses = [
      {
        key: '',
        text: 'All'
      },
      {
        key: 'inactive',
        text: 'Inactive'
      },
      {
        key: 'active',
        text: 'Active'
      }
    ];

    return (
      <>
        <Head>
          <title>Categories</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Categories' }]} />
        <Page>
          <SearchFilter
            statuses={statuses}
            onSubmit={this.handleFilter.bind(this)}
          />
          <div style={{ marginBottom: '20px' }} />
          <TableListCategory
            dataSource={list}
            pagination={{ ...pagination, showSizeChanger: false }}
            rowKey="_id"
            loading={fetching}
            onChange={this.handleTableChange.bind(this)}
            deleteCategory={this.deleteCategory.bind(this)}
          />
        </Page>
      </>
    );
  }
}

export default categorys;
