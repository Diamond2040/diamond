import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Modal,
  Button,
  Tag,
  Form,
  TimePicker,
  InputNumber,
  Space
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export const BookingEventModal = ({
  selectedDate,
  availableSlots = [],
  visible,
  onCancel,
  onBooking,
  submiting,
  wrapClassName
}: any) => {
  const selectedDateSlots = availableSlots.filter((slot) => moment(slot.startAt).isSame(moment(selectedDate), 'date'));
  const [form] = Form.useForm();
  const [bookingSlot, setBookingSlot] = useState(null);

  useEffect(() => {
    setBookingSlot(null);
  }, [visible]);

  useEffect(() => {
    form && form.resetFields();
    if (bookingSlot) {
      const availableSlot = availableSlots.find((s) => s._id === bookingSlot);
      form.setFieldsValue({ startAt: moment(availableSlot.startAt) });
    }
  }, [bookingSlot]);

  const getDisabledHours = (): number[] => {
    const hours = [];
    if (bookingSlot) {
      const availableSlot = availableSlots.find((s) => s._id === bookingSlot);
      for (let i = 0; i < moment(availableSlot.startAt).hour(); i += 1) {
        hours.push(i);
      }

      for (let i = 24; i > moment(availableSlot.endAt).hour(); i -= 1) {
        hours.push(i);
      }
      return hours;
    }

    if (selectedDate.isAfter(moment())) return hours;
    for (let i = 0; i < moment().hour(); i += 1) {
      hours.push(i);
    }
    return hours;
  };

  const getDisableMinutes = (): number[] => {
    const minutes = [];
    if (bookingSlot) {
      const availableSlot = availableSlots.find((s) => s._id === bookingSlot);
      for (let i = 0; i < moment(availableSlot.startAt).minute(); i += 1) {
        minutes.push(i);
      }

      return minutes;
    }

    if (selectedDate.isAfter(moment())) return minutes;
    for (let i = 0; i < moment().minute(); i += 1) {
      minutes.push(i);
    }
    return minutes;
  };

  return (
    <Modal
      title="Schedule"
      width={990}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName={wrapClassName}
    >
      <div style={{ margin: '15px 0' }}>
        <p>
          Current slots on
          {' '}
          <b>{moment(selectedDate).format('dddd, MMMM Do YYYY')}</b>
        </p>
        <Row>
          <Col span={4}>Title</Col>
          {/* <Col span={4}>Price</Col> */}
          <Col span={4}>Start</Col>
          <Col span={4}>End</Col>
          <Col span={4}>Available</Col>
          <Col span={4}>#</Col>
        </Row>
        {selectedDateSlots && selectedDateSlots.length > 0 ? (
          selectedDateSlots.map((item) => (
            <Row key={item._id}>
              <Col span={4}>{item.name}</Col>
              {/* <Col span={4}>{item.price}</Col> */}
              <Col span={4}>{moment(item.startAt).format('HH:mm')}</Col>
              <Col span={4}>{moment(item.endAt).format('HH:mm')}</Col>
              <Col span={4}>
                <Tag
                  color={
                    item.isBooked || moment().isAfter(moment(item.start))
                      ? 'error'
                      : 'success'
                  }
                >
                  {item.isBooked || moment().isAfter(moment(item.start))
                    ? 'N'
                    : 'Y'}
                </Tag>
              </Col>
              <Col span={4}>
                <Button
                  type={item._id === bookingSlot ? 'primary' : 'default'}
                  onClick={() => setBookingSlot(item._id)}
                  className="btn-book"
                >
                  <span className="book">Book</span>
                </Button>
              </Col>
            </Row>
          ))
        ) : (
          <p>No slot found</p>
        )}
        {bookingSlot && (
          <Form
            {...layout}
            name="schedule-event-modal"
            form={form}
            onFinish={(values) => {
              if (!bookingSlot) {
                return;
              }

              const data = { ...values };
              onBooking({
                ...data,
                scheduleId: bookingSlot,
                startAt: moment(data.startAt)
                  .set('date', moment(selectedDate).date())
                  .set('month', moment(selectedDate).month())
                  .set('year', moment(selectedDate).year())
              });
              form.resetFields();
            }}
          >
            <Form.Item
              label="Start At"
              name="startAt"
              rules={[
                { required: true, message: 'This field is required!' },
                {
                  validator: (_, v) => {
                    if (moment.isMoment(v)) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Please select time'));
                  }
                }
              ]}
            >
              <TimePicker
                disabledHours={getDisabledHours}
                disabledMinutes={getDisableMinutes}
                format="HH:mm"
              />
            </Form.Item>
            <Form.Item
              name="duration"
              label="Duration"
              rules={[
                { required: true, message: 'This field is required!' },
                ({ getFieldValue }) => ({
                  validator(_, v) {
                    if (!v || !bookingSlot) {
                      return Promise.resolve();
                    }

                    const availableSlot = availableSlots.find(
                      (s) => s._id === bookingSlot
                    );
                    const startAt = getFieldValue('startAt');
                    const diff = moment(availableSlot.endAt).diff(
                      moment(startAt)
                        .set('date', moment(selectedDate).date())
                        .set('month', moment(selectedDate).month())
                        .set('year', moment(selectedDate).year()),
                      'minute'
                    );

                    if (v < diff) {
                      return Promise.resolve();
                    }

                    return Promise.reject(new Error('Booking outside of the scheduled time'));
                  }
                })
              ]}
              dependencies={['startAt']}
            >
              <InputNumber min={0} />
            </Form.Item>
            <Form.Item label="Message" name="message">
              <TextArea rows={3} />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button type="primary" loading={submiting} htmlType="submit">
                  <CheckCircleOutlined />
                  {' '}
                  Send Booking
                </Button>
                <Button
                  onClick={() => [form.resetFields(), setBookingSlot(null)]}
                >
                  Reset
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </div>
    </Modal>
  );
};
