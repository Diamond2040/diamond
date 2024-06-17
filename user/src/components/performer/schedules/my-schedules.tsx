import { PureComponent } from 'react';
import { message, Calendar, Tooltip } from 'antd';
import moment from 'moment';
import { scheduleService } from '@services/index';
import classNames from 'classnames';
import { ScheduleEventModal } from './schedule-event-modal';
import './schedule.less';

interface P {}

interface S {
  availableSlots: any;
  total: number;
  modalVisible: boolean;
  selectedDate: moment.Moment;
  visisbleDate: moment.Moment;
  submiting: boolean;
  success: boolean;
  mode: 'month' | 'year';
}

export class MySchedules extends PureComponent<P, S> {
  constructor(props: P) {
    super(props);
    this.state = {
      availableSlots: [],
      total: null,
      success: false,
      modalVisible: false,
      selectedDate: moment(),
      visisbleDate: moment(),
      submiting: false,
      mode: 'month'
    };
  }

  componentDidMount() {
    this.getAvailableSlots();
  }

  componentDidUpdate(_, prevState: S) {
    const { visisbleDate } = this.state;
    if (visisbleDate !== prevState.visisbleDate) {
      this.getAvailableSlots();
    }
  }

  onCalenderPanelChange(_, mode: 'month' | 'year') {
    this.setState({ mode });
    this.getAvailableSlots();
  }

  async onDeleteSlot(slotId: string) {
    const { availableSlots } = this.state;

    const slot = availableSlots.find((s) => s._id === slotId);
    if (!window.confirm('Are you sure you would like to remove this slot?')) return;
    if (slot.isBooked) {
      message.error(
        'This slot is already booked, could not delete at this time'
      );
      return;
    }
    try {
      this.setState({ submiting: true });
      await scheduleService.deleteSchedule(slotId);
      this.getAvailableSlots();
    } catch (e) {
      const err = await e;
      message.error(err.message || 'Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
  }

  async onSelectDate(date: moment.Moment) {
    const { mode } = this.state;
    if (mode === 'year') {
      return;
    }

    const currentDate = moment();
    if (moment(date).isBefore(currentDate, 'date')) {
      message.error('Please just schedule slot in the future time');
      return;
    }

    this.setState({ modalVisible: true, selectedDate: date });
  }

  async getAvailableSlots() {
    try {
      const { visisbleDate } = this.state;
      const resp = await (
        await scheduleService.performerGetSchedules({
          startAt: moment(moment(visisbleDate).subtract(1, 'month')).startOf('month').toISOString(),
          endAt: moment(moment(visisbleDate).add(1, 'month')).endOf('month').toISOString()
        })
      ).data;
      this.setState({ availableSlots: resp.data, total: resp.total });
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(error.message || 'Error occured, please try again later');
    } finally {
      this.setState({ success: true });
    }
  }

  // eslint-disable-next-line react/sort-comp
  handleCloseModal() {
    this.setState({
      modalVisible: false
    });
  }

  async createNewSlot(data) {
    try {
      this.setState({ submiting: true });
      if (data.editingSlot) {
        await scheduleService.updateSchedule(data.editingSlot, data);
      } else {
        await scheduleService.createSchedule(data);
      }
      message.success('Success');
      this.getAvailableSlots();
      this.setState({ modalVisible: false });
    } catch (e) {
      const err = await e;
      message.error(err.message || 'Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
    return undefined;
  }

  dateSlotsRender(value) {
    const listData = this.renderSlots(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li
            key={item._id}
            className={
              item.type === 'success'
                ? 'event-status success'
                : 'event-status error'
            }
          >
            <Tooltip title={`${item.description || item.name}`}>
              {item.content}
            </Tooltip>
          </li>
        ))}
      </ul>
    );
  }

  disabledDate(date) {
    return moment(date).endOf('day').isBefore(moment());
  }

  renderSlots(value) {
    const { availableSlots } = this.state;
    const listData = availableSlots.map((slot) => {
      if (value.isSame(moment(slot.startAt), 'date')) {
        return {
          ...slot,
          type:
            !slot.isBooked && moment().isBefore(moment(slot.startAt))
              ? 'success'
              : 'error',
          content: `${moment(slot.startAt).format('HH:mm')} - ${moment(
            slot.endAt
          ).format('HH:mm')}`
        };
      }
      return slot;
    });
    return listData || [];
  }

  render() {
    const {
      modalVisible,
      selectedDate,
      visisbleDate,
      availableSlots,
      submiting,
      total,
      success
    } = this.state;
    return (
      <>
        <div style={{ marginBottom: '25px' }}>
          <div className="text-center" style={{ padding: '15px' }}>
            Booking Schedule Slot in
            {' '}
            {moment(visisbleDate).format('MMMM YYYY')}
            {' '}
            Select a date to begin.
            <br />
            {success && total === 0 && 'Select date to create new slot'}
          </div>
          <Calendar
            className="performer-calendar"
            dateFullCellRender={(date) => (
              <div
                className={classNames('ant-picker-cell-inner', 'ant-picker-calendar-date', {
                  'ant-picker-calendar-date-today': moment().isSame(date, 'date')
                })}
                onClick={() => this.onSelectDate(date)}
                aria-hidden="true"
              >
                <div className="ant-picker-calendar-date-value">
                  {moment(date).get('date')}
                </div>
                <div className="ant-picker-calendar-date-content">
                  {this.dateSlotsRender(date)}
                </div>
              </div>
            )}
            onChange={(date) => {
              this.setState({ visisbleDate: date });
            }}
            // value={visisbleDate}
            onPanelChange={this.onCalenderPanelChange.bind(this)}
            disabledDate={this.disabledDate.bind(this)}
            validRange={([moment().startOf('years'), moment().add(5, 'years').endOf('years')]) as any}
          />

          {selectedDate && (
            <ScheduleEventModal
              visible={modalVisible}
              onCancel={this.handleCloseModal.bind(this)}
              selectedDate={selectedDate}
              availableSlots={availableSlots}
              onSubmit={this.createNewSlot.bind(this)}
              submiting={submiting}
              onDeleteSlot={this.onDeleteSlot.bind(this)}
              wrapClassName="schedule-modal-wrapper"
            />
          )}
        </div>
      </>
    );
  }
}
