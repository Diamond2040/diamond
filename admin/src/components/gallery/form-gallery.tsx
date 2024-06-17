import { PureComponent, createRef } from 'react';
import {
  Form, Input, Button, Select, message
} from 'antd';
import { IGallery } from 'src/interfaces';
import { SelectPerformerDropdown } from '@components/common/select-performer-dropdown';
import { SelectCategoryDropdown } from '@components/common/select-category-dropdown';
import { FormInstance } from 'antd/lib/form';
import { BulkUploadPhotoForm } from './form-gallery-photos';

interface IProps {
  gallery?: IGallery;
  onFinish: Function;
  submiting?: boolean;
}

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!'
};

export class FormGallery extends PureComponent<IProps> {
  formRef: any;

  componentDidMount() {
    if (!this.formRef) this.formRef = createRef();
  }

  setFormVal(field: string, val: any) {
    const instance = this.formRef.current as FormInstance;
    instance && instance.setFieldsValue({
      [field]: val
    });
  }

  render() {
    if (!this.formRef) this.formRef = createRef();
    const {
      gallery, onFinish, submiting
    } = this.props;
    return (
      <Form
        {...layout}
        ref={this.formRef}
        onFinish={onFinish.bind(this)}
        initialValues={
          gallery || {
            name: '',
            description: '',
            price: 0,
            status: 'active',
            performerIds: []
          }
        }
        validateMessages={validateMessages}
        onFinishFailed={() => message.error('Please complete the required fields')}
        name="form-upload"
      >
        <Form.Item name="performerIds" label="Performers" rules={[{ required: true }]}>
          <SelectPerformerDropdown
            noEmtpy
            defaultValue={gallery && gallery.performerIds}
            onSelect={(val) => this.setFormVal('performerIds', val)}
            isMultiple
          />
        </Form.Item>
        <Form.Item label="Categories" name="categoryIds">
          <SelectCategoryDropdown
            noEmtpy
            defaultValue={gallery && gallery.categoryIds}
            group="gallery"
            onSelect={(val) => this.setFormVal('categoryIds', val)}
            isMultiple
          />
        </Form.Item>
        <Form.Item name="name" rules={[{ required: true, message: 'Please input title of gallery!' }]} label="Name">
          <Input placeholder="Enter gallery name" />
        </Form.Item>
        {/* <Form.Item name="price" label="Price">
          <InputNumber />
        </Form.Item> */}
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
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
        {gallery && (<BulkUploadPhotoForm galleryId={gallery._id} />)}
        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginTop: '10px' }} loading={submiting}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  }
}
