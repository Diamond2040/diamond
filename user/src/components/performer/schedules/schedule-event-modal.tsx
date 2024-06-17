import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Modal,
  TimePicker,
  Form,
  Button,
  Tag,
  Alert,
  Space,
  Input,
  InputNumber,
  Checkbox,
  Dropdown,
  Menu
} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined
} from '@ant-design/icons';
import moment from 'moment';
import TextArea from 'antd/lib/input/TextArea';

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

export const ScheduleEventModal = ({
  selectedDate,
  availableSlots = [],
  visible = false,
  submiting = false,
  onCancel,
  onSubmit,
  onDeleteSlot,
  wrapClassName
}: any) => {
  const [editingSlot, setEditingSlot] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    form && form.resetFields();
    setEditingSlot(null);
  }, [visible]);

  const getDisabledHours = () => {
    const hours = [];
    if (selectedDate.isAfter(moment())) return hours;
    for (let i = 0; i < moment().hour(); i += 1) {
      hours.push(i);
    }
    return hours;
  };

  const onEditSlot = (id: string) => {
    const slot = availableSlots.find((s) => s._id === id);
    setEditingSlot(id);
    form.setFieldsValue({
      ...slot,
      schedule: [moment(slot.startAt), moment(slot.endAt)]
    });
  };

  const selectedDateSlots = availableSlots.filter((slot) => moment(slot.startAt).isSame(moment(selectedDate), 'date'));

  return (
    <Modal
      title="Schedule"
      width={990}
      visible={visible}
      onCancel={onCancel}
      footer={null}
      wrapClassName={wrapClassName}
    >
      <Form
        {...layout}
        name="schedule-event-modal"
        form={form}
        onFinish={(values) => {
          const data = { ...values };
          [data.startAt, data.endAt] = data.schedule;
          delete data.schedule;
          if (editingSlot) {
            data.editingSlot = editingSlot;
          }
          onSubmit({
            ...data,
            startAt: moment(data.startAt)
              .set('date', moment(selectedDate).date())
              .set('month', moment(selectedDate).month())
              .set('year', moment(selectedDate).year()),
            endAt: moment(data.endAt)
              .set('date', moment(selectedDate).date())
              .set('month', moment(selectedDate).month())
              .set('year', moment(selectedDate).year())
          });
          form.resetFields();
        }}
      >
        <Alert
          type="warning"
          message={`Please take note about timezone GMT ${moment(
            selectedDate
          ).format('Z')}`}
        />
        <div style={{ margin: '10px 0' }}>
          <p className="text-center">
            Current slots on
            {' '}
            <b>{moment(selectedDate).format('dddd, MMMM Do YYYY')}</b>
          </p>
          <Row wrap>
            <Col span={4}>Title</Col>
            {/* <Col span={4}>Price</Col> */}
            <Col span={4}>Start</Col>
            <Col span={4}>End</Col>
            <Col span={4}>Available</Col>
            <Col span={4} style={{ textAlign: 'center' }}>#</Col>
          </Row>
          {selectedDateSlots && selectedDateSlots.length > 0 && (
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
                  <Space size={5}>
                    <Button
                      className="btn-desktop"
                      disabled={item.isBooked || submiting}
                      onClick={() => onEditSlot(item._id)}
                    >
                      <EditOutlined />
                    </Button>
                    <Button
                      className="btn-desktop"
                      disabled={item.isBooked || submiting}
                      onClick={() => onDeleteSlot(item._id)}
                    >
                      <DeleteOutlined />
                    </Button>
                    <Dropdown
                      overlay={(
                        <Menu>
                          <Menu.Item
                            disabled={item.isBooked || submiting}
                            onClick={() => onEditSlot(item._id)}
                          >
                            Update
                          </Menu.Item>
                          <Menu.Item
                            disabled={item.isBooked || submiting}
                            onClick={() => onDeleteSlot(item._id)}
                          >
                            Delete
                          </Menu.Item>
                        </Menu>
                    )}
                    >
                      <Button className="btn-mobile">
                        <MoreOutlined />
                      </Button>
                    </Dropdown>
                  </Space>
                </Col>
              </Row>
            ))
          )}
          <p className="text-center">{selectedDateSlots && selectedDateSlots.length > 0 ? 'Create new slot' : 'No slot added'}</p>

        </div>
        <Form.Item
          name="name"
          label="Title"
          wrapperCol={{ span: 12 }}
        >
          <Input type="text" />
        </Form.Item>
        <Form.Item name="price" label="Price" hidden>
          <InputNumber min={0} />
        </Form.Item>
        <Form.Item
          label="Schedule"
          name="schedule"
          rules={[
            { required: true, message: 'This field is required!' },
            {
              validator: (_, v) => {
                if (Array.isArray(v) && v.every((t) => moment.isMoment(t))) {
                  return Promise.resolve();
                }

                return Promise.reject(new Error('Please select time'));
              }
            }
          ]}
        >
          <TimePicker.RangePicker
            disabledHours={getDisabledHours}
            format="HH:mm"
            minuteStep={5}
          />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={3} />
        </Form.Item>
        {editingSlot && (
          <Form.Item name="isBooked" valuePropName="checked" label="Is Booked?">
            <Checkbox />
          </Form.Item>
        )}
        <Form.Item>
          <Space>
            <Button type="primary" disabled={submiting} htmlType="submit">
              Submit
            </Button>
            <Button onClick={() => [form.resetFields(), setEditingSlot(null)]}>
              Reset
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};
