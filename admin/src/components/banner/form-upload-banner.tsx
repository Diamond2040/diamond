/* eslint-disable no-useless-escape */
import ImgCrop from 'antd-img-crop';
import { PureComponent } from 'react';
import {
  Form, Input, Select, Upload, Button, message, Progress
} from 'antd';
import { IBannerUpdate, IBannerCreate } from 'src/interfaces';
import { LoadingOutlined, UploadOutlined } from '@ant-design/icons';
import { ThumbnailBanner } from '@components/banner/thumbnail-banner';
import { getGlobalConfig } from '@services/config';

interface IProps {
  banner?: IBannerUpdate;
  submit: Function;
  beforeUpload?: Function;
  uploading?: boolean;
  uploadPercentage?: number;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export class FormUploadBanner extends PureComponent<IProps> {
  onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  handleChange = (info) => {
    const { beforeUpload: handleBeforeUpload } = this.props;
    handleBeforeUpload(info.file.originFileObj);
  };

  beforeUpload(file) {
    const config = getGlobalConfig();
    const isMaxSize = file.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5);
    if (!isMaxSize) {
      return message.error(`Image must be smaller than ${config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB!`);
    }
    return isMaxSize;
  }

  render() {
    const {
      banner, submit, uploading, uploadPercentage
    } = this.props;
    const haveBanner = !!banner;
    return (
      <Form
        {...layout}
        onFinish={submit && submit.bind(this)}
        onFinishFailed={() => message.error('Please complete the required fields')}
        name="form-upload-banner"
        validateMessages={validateMessages}
        initialValues={
          banner
          || ({
            title: '',
            description: '',
            link: '',
            status: 'active',
            position: 'homeTop'
          } as IBannerCreate)
        }
      >
        <Form.Item name="title" rules={[{ required: true, message: 'Please input title of banner!' }]} label="Title">
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item
          name="link"
          label="Direct link"
          rules={[
            // eslint-disable-next-line no-useless-escape
            {
              pattern: /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/,
              message: 'Invalid url format'
            }
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Position" rules={[{ required: true, message: 'Please select position!' }]}>
          <Select>
            <Select.Option key="homeTop" value="homeTop">
              Home Top
            </Select.Option>
            <Select.Option key="homeBottom" value="homeBottom">
              Home Bottom
            </Select.Option>
            <Select.Option key="rightSidebar" value="rightSidebar">
              Right Sidebar
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true, message: 'Please select status!' }]}>
          <Select>
            <Select.Option key="active" value="active">
              Active
            </Select.Option>
            <Select.Option key="inactive" value="inactive">
              Inactive
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Banner" help="Ratio dimension 4:1 (eg: 1600px:400px)">
          {haveBanner ? (
            <ThumbnailBanner banner={banner} style={{ width: '100%' }} />
          ) : (
            <ImgCrop aspect={4 / 1} shape="rect" quality={1} modalTitle="Edit cover image" modalWidth={768}>
              <Upload
                accept="image/*"
                listType="picture-card"
                showUploadList
                beforeUpload={this.beforeUpload.bind(this)}
                onChange={this.handleChange}
                onPreview={this.onPreview}
                disabled={uploading}
              >
                {uploading ? <LoadingOutlined /> : <UploadOutlined />}
              </Upload>
            </ImgCrop>
          )}
        </Form.Item>
        {uploadPercentage ? (
          <div>
            <Progress percent={uploadPercentage} />
          </div>
        ) : null}
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={uploading} disabled={uploading}>
            {haveBanner ? 'Update' : 'Upload'}
          </Button>
          &nbsp;
          <Button disabled={uploading} href="/banner">
            Cancel
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
