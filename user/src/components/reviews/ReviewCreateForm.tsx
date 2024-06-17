import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  Form, Input, Button, Rate, Divider, message
} from 'antd';
import { reviewService } from 'src/services';
import './reviewCreateForm.less';
import { getResponseError } from '@lib/utils';

interface ReviewCreateFormProps {
  loggedIn: boolean;
  currentUser: any;
  loading: boolean;
  source: string;
  sourceId: string;
  onFinish: Function;
}

const { TextArea } = Input;

const ReviewCreateForm = ({
  loggedIn,
  currentUser,
  loading,
  source,
  sourceId,
  onFinish
}: ReviewCreateFormProps) => {
  const [rating, setRate] = useState(5);
  const ref = useRef(null);

  const finish = async (data) => {
    try {
      if (!loggedIn) {
        message.error('Please logged in!');
        return;
      }
      const resp = await reviewService.create({
        source,
        sourceId,
        ...data,
        rating
      });
      onFinish({
        ...resp.data,
        reviewer: currentUser
      });
      ref.current.setFieldsValue({
        comment: ''
      });
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    }
  };

  return (
    <div
      id="review-list"
    >
      <Form
        ref={ref}
        initialValues={{
          comment: ''
        }}
        className="comment-form"
        onFinish={finish}
      >
        <h3 className="card-title">WRITE A REVIEW</h3>
        <p className="hint">Your review will be posted on the site.</p>
        <Divider />
        <img src={currentUser?.avatar || '/no-avatar.png'} alt="" />
        {' '}
        {currentUser?.username}
        <Form.Item>
          <Rate
            disabled={loading || !loggedIn}
            value={rating}
            onChange={(val) => setRate(val)}
          />
        </Form.Item>
        <Form.Item
          name="comment"
          rules={[
            { required: true, message: 'Please add your reviews' },
            {
              min: 10,
              message: 'Please input atleast 20 characters'
            }
          ]}
        >
          <TextArea
            disabled={!loggedIn}
            rows={3}
            placeholder={
            loggedIn ? 'Write your review' : 'Please login to write review!'
          }
          />
        </Form.Item>
        <Button
          htmlType="submit"
          type="primary"
          disabled={loading || !loggedIn}
          loading={loading}
        >
          Send
        </Button>
      </Form>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  loggedIn: state.auth.loggedIn,
  currentUser: state.user.current
});
export default connect(mapStateToProps)(ReviewCreateForm);
