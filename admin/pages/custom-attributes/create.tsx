import Head from 'next/head';
import Page from '@components/common/layout/page';
import {
  Form, Input, Button, Select, message, Breadcrumb
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { attributeService } from '@services/attribute';

export default function CreateAttribute() {
  const submit = async (data) => {
    try {
      await attributeService.create(data);
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
        <title>Create new Attribute</title>
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
          <Breadcrumb.Item>Create new Attribute</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Page>
        <Form
          onFinish={submit}
          initialValues={{
            name: '',
            key: '',
            group: 'bustSize'
          }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
        >
          <Form.Item name="group" label="Group" rules={[{ required: true, message: 'Please select group!' }]}>
            <Select>
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
            <Input placeholder="Enter key" />
          </Form.Item>

          <Form.Item name="value" rules={[{ required: true, message: 'Please input value!' }]} label="Value">
            <Input placeholder="Enter attribute value" />
          </Form.Item>

          <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
            Submit
          </Button>
        </Form>
      </Page>
    </>
  );
}
