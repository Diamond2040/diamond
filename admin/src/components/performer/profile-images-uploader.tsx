import {
  Button, Divider, Image, message, Table, Tag
} from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { useState, useEffect } from 'react';
import {
  UploadOutlined, DeleteOutlined
} from '@ant-design/icons';
import { getGlobalConfig } from '@services/config';
import { performerService } from '@services/performer.service';

interface Props {
  performerId: string;
}

export default function ProfileImagesUploads({
  performerId
}: Props) {
  const config = getGlobalConfig();
  const [photos, setPhotos] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const findPhotos = async () => {
    setLoading(true);
    const resp = await performerService.allProfileImages(performerId);
    setPhotos(resp.data);
    setLoading(false);
  };

  const beforeUpload = (file, fileL) => {
    if (file.size / 1024 / 1024 > (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5)) {
      message.error(`${file.name} is over ${config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}MB`);
    }

    setFileList([
      ...fileList,
      ...fileL.filter((f) => f.size / 1024 / 1024 < (config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5))
    ]);
    return false;
  };

  const onRemove = (file) => {
    const newList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newList);
  };

  const bunkUpload = async () => {
    try {
      setUploading(true);
      await fileList.reduce(async (lastPromise, file) => {
        await lastPromise;

        // TODO - should change with profile images service and payload data
        return performerService.imageUpload(file, {
          performerId
        }, () => {});
      }, Promise.resolve());

      message.success('upload successfully');

      // reload photo list
      findPhotos();
      // reset default file list
      setFileList([]);
      setUploading(false);
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
      setUploading(false);
    }
  };

  // component did mount / did update
  useEffect(() => {
    if (performerId) findPhotos();
  }, [performerId]);

  const deleteImage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) {
      return false;
    }
    try {
      await performerService.deleteProfileImage(id);
      message.success('Deleted successfully');
      await findPhotos();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
    return undefined;
  };

  const setAvatar = async (id) => {
    try {
      await performerService.setAvatar(performerId, id);
      message.success('Set avatar successfully');
      await findPhotos();
    } catch (e) {
      const err = (await Promise.resolve(e)) || {};
      message.error(err.message || 'An error occurred, please try again!');
    }
    return undefined;
  };

  const columns = [
    {
      title: '',
      dataIndex: 'thumbnail',
      render(data, record) {
        return <Image src={record.file?.fileUrl} width={150} />;
      }
    },
    {
      title: 'Main image / avatar?',
      dataIndex: 'isMainImage',
      render(isMainImage, record) {
        return isMainImage ? (
          <Tag color="green">Yes</Tag>
        ) : (
          <Tag color="red" onClick={() => setAvatar(record._id)} style={{ cursor: 'pointer' }}>
            No
          </Tag>
        );
      }
    },
    {
      title: 'Actions',
      dataIndex: '_id',
      render: (id: string) => <DeleteOutlined onClick={() => deleteImage(id)} />
    }
  ];

  return (
    <div>
      <Table
        dataSource={photos}
        columns={columns}
        rowKey="_id"
        loading={loading}
      />

      <Divider />
      <Dragger
        accept="image/*"
        beforeUpload={beforeUpload}
        multiple
        showUploadList
        disabled={uploading}
        listType="text"
        onRemove={onRemove}
        fileList={fileList}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">Click or drag files to this area to upload</p>
        <p className="ant-upload-hint">
          Image must be
          {' '}
          {config.NEXT_PUBLIC_MAX_SIZE_IMAGE || 5}
          MB or below
        </p>
      </Dragger>

      <Divider />

      <Button
        type="primary"
        htmlType="submit"
        loading={uploading}
        disabled={uploading || !fileList?.length}
        onClick={bunkUpload}
      >
        Upload All
      </Button>
    </div>
  );
}
