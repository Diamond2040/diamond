import Router from 'next/router';
import Head from 'next/head';
import {
  Form, Input, Button, Select, message, Spin, Breadcrumb
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useEffect, useState, Fragment } from 'react';

import Link from 'next/link';
import { attributeService } from '@services/attribute';
import Page from '@components/common/layout/page';

export default function UpdateAttribute() {
  const [attribute, setAttribute] = useState(null);

  const findAttr = async () => {
    try {
      const { id } = Router.query;

      const resp = await attributeService.findById(id as string);
      setAttribute(resp.data);
    } catch (e) {
      const err = await e;
      message.error(
        err?.message || 'An error occurred, please check try again!'
      );
    }
  };

  // fill to form
  useEffect(() => {
    findAttr();
  }, []);

  // submit
  const submit = async (data) => {
    try {
      await attributeService.update(attribute._id, data);
      message.success('Attribute has been updated!');
      // redirect to list page
      // force reload to update redux
      window.location.href = '/custom-attributes';
    } catch (e) {
      const err = await e;
      message.error(
        err?.message || 'An error occurred, please check try again!'
      );
    }
  };

  return (
    <>
      <Head>
        <title>Update attribute</title>
      </Head>
      <div style={{ marginBottom: '16px' }}>
        <Breadcrumb>
          <Breadcrumb.Item href="/dashboard">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link href="/custom-attributes" as="/custom-attributes">
              <a>Attribute</a>
            </Link>
          </Breadcrumb.Item>
          {attribute && <Breadcrumb.Item>{attribute.name}</Breadcrumb.Item>}
          <Breadcrumb.Item>Update</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Page>
        {!attribute ? (
          <Spin size="large" />
        ) : (
          <Form onFinish={submit} initialValues={attribute} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
            <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select group!' }]}>
              <Select disabled>
                {attributeService.getGroups().map((a) => (
                  <Select.Option key={a.key} value={a.key}>
                    {a.text}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="key"
              label="Key"
              help="Unique, no special chars (incude space)"
              rules={[{ required: true, message: 'Please enter key!' }]}
            >
              <Input placeholder="Enter key" disabled />
            </Form.Item>

            <Form.Item name="value" rules={[{ required: true, message: 'Please input value!' }]} label="Value">
              <Input placeholder="Enter attribute value" />
            </Form.Item>

            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              Submit
            </Button>
          </Form>
        )}
      </Page>
    </>
  );
}
