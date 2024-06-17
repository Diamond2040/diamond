import Link from 'next/link';
import Head from 'next/head';
import {
  HomeOutlined,
  DownOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import { useEffect, useState } from 'react';
import {
  Table, message, Dropdown, Menu, Button, Breadcrumb, Row, Input, Col, Select
} from 'antd';
import Page from '@components/common/layout/page';

import { attributeService } from '@services/attribute';
import Router from 'next/router';

export default function ListCustomAttributes() {
  const [searching, setSearching] = useState(true);
  const [attributeDataHolder, setAttributeDataHolder] = useState({
    data: [],
    total: 0
  });
  const [attributeData, setAttributeData] = useState({
    data: [],
    total: 0
  });
  const [searchVal, setSearchVal] = useState({
    group: '',
    q: ''
  });
  const pageSize = 10;

  const loadData = async (page = 1) => {
    setSearching(true);
    const limit = pageSize;
    const offset = (page - 1) * limit;

    const query = {
      limit,
      offset
    };

    const resp = await attributeService.list(query);
    setAttributeDataHolder({ ...resp.data });
    setAttributeData({ ...resp.data });
    setSearching(false);
  };

  const remove = async (id) => {
    try {
      if (!window.confirm('Are you sure?')) return;

      await attributeService.delete(id);
      // remove item form list // or reload
      Router.reload();
    } catch (e) {
      const err = await e;
      message.error(
        err?.message || 'An error occurred, please check try again!'
      );
    }
  };

  const onSearch = () => {
    let items = attributeDataHolder.data;
    if (searchVal.group) items = items.filter((d) => d.group === searchVal.group);
    if (searchVal.q) {
      items = items.filter(
        (i) => i.key.toLowerCase().includes(searchVal.q.toLowerCase())
          || i.value.toLowerCase().includes(searchVal.q.toLowerCase())
      );
    }
    setAttributeData({
      data: items,
      total: items.length
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const columns = [
    {
      title: 'Group',
      dataIndex: 'group'
    },
    {
      title: 'Key',
      dataIndex: 'key'
    },
    {
      title: 'Value',
      dataIndex: 'value'
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id: string) => (
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="edit">
                <Link
                  href={{
                    pathname: '/custom-attributes/update',
                    query: { id }
                  }}
                >
                  <a>
                    <EditOutlined />
                    {' '}
                    Update
                  </a>
                </Link>
              </Menu.Item>
              <Menu.Item
                key="delete"
                onClick={() => remove(id)}
              >
                <span>
                  <DeleteOutlined />
                  {' '}
                  Delete
                </span>
              </Menu.Item>
            </Menu>
            )}
        >
          <Button>
            Actions
            {' '}
            <DownOutlined />
          </Button>
        </Dropdown>
      )
    }
  ];

  const renderFilter = () => (
    <div>
      <Row gutter={24}>
        <Col lg={6} md={8} xs={12}>
          <Input
            placeholder="Enter keyword"
            onChange={(evt) => setSearchVal({
              ...searchVal,
              q: evt.target.value
            })}
            onPressEnter={() => onSearch()}
          />
        </Col>
        <Col lg={6} md={8} xs={12}>
          <Select
            style={{ width: '100%' }}
            onChange={(group: any) => setSearchVal({
              ...searchVal,
              group
            })}
          >
            <Select.Option key="all" value="">
              All groups
            </Select.Option>
            {attributeService.getGroups().map((a) => (
              <Select.Option key={a.key} value={a.key}>
                {a.text}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} md={8} xs={12}>
          <Button onClick={() => onSearch()}>Search</Button>
        </Col>
      </Row>
    </div>
  );

  return (
    <Page>
      <Head>
        <title>List Attribute</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>List Attribute</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {renderFilter()}

      <Table
        dataSource={attributeData.data}
        columns={columns}
        rowKey="_id"
        loading={searching}
        pagination={{
          pageSize,
          total: attributeData.total
        }}
      />
    </Page>
  );
}
