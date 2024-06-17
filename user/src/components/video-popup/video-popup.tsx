import { useState } from 'react';
import { CaretRightOutlined } from '@ant-design/icons';
import {
  Modal, Button
} from 'antd';
import './video-popup.less';

interface IProps {
  getYtbEmbeddedLink: Function;
  introVideoLink: any;
}

export function VideoPopUp({
  getYtbEmbeddedLink,
  introVideoLink
}: IProps) {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <div className="App">
      <Button type="primary" shape="circle" icon={<CaretRightOutlined />} onClick={() => setModalVisible(true)} />

      <Modal
        className="video-popup-modal"
        title="Product name"
        visible={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        bodyStyle={{ padding: 0 }}
        centered
        closeIcon
      >
        <iframe
          width="560"
          height="315"
          src={getYtbEmbeddedLink(introVideoLink)}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </Modal>
    </div>
  );
}
