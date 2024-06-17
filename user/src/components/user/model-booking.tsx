import { PureComponent } from 'react';
import { message, Calendar, Tooltip } from 'antd';
import moment from 'moment';
import { scheduleService } from 'src/services';
import { IPerformer, IUser } from 'src/interfaces';
import classNames from 'classnames';
import { BookingEventModal } from './model-booking-modal';
import './model-booking.less';

interface P {
  currentUser: IUser | IPerformer;
  performer: IPerformer;
}

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

export class UserModelBooking extends PureComponent<P, S> {
  private interval: NodeJS.Timeout;

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
    const { performer } = this.props;
    performer && this.getAvailableSlots();
  }

  componentDidUpdate(prevProps: P, prevState: S) {
    const { performer } = this.props;
    if (prevProps.performer !== performer) {
      this.getAvailableSlots();
    }

    const { visisbleDate } = this.state;
    if (visisbleDate !== prevState.visisbleDate) {
      this.getAvailableSlots();
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  onCalenderPanelChange(_, mode: 'month' | 'year') {
    this.setState({ mode });
    this.getAvailableSlots();
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

  async onBookingSlot(data) {
    const { isBooked } = data;
    if (isBooked) {
      message.error('This slot is already booked, please choose another one');
      return;
    }

    try {
      this.setState({ submiting: true });
      await scheduleService.bookSlot(data);
      message.success('Success');
      this.getAvailableSlots();
      this.setState({ modalVisible: false });
    } catch (e) {
      const err = await e;
      message.error(err.message || 'Error occured, please try again later');
    } finally {
      this.setState({ submiting: false });
    }
  }

  getAvailableSlotsInterval() {
    this.interval = setInterval(() => {
      this.getAvailableSlots();
    }, 15000);
  }

  async getAvailableSlots() {
    try {
      const { performer } = this.props;
      const { visisbleDate } = this.state;
      const resp = await (
        await scheduleService.userGetSchedules({
          startAt: moment(moment(visisbleDate).subtract(1, 'month')).startOf('month').toISOString(),
          endAt: moment(moment(visisbleDate).add(1, 'month')).endOf('month').toISOString(),
          userId: performer.userId
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

  disabledDate(date: moment.Moment) {
    const { availableSlots } = this.state;
    if (moment(date).endOf('day').isBefore(moment())) {
      return true;
    }

    const isAvailable = availableSlots.find((slot) => moment(slot.startAt).isBetween(moment(date).startOf('date'), moment(date).endOf('date')));
    if (isAvailable) {
      return false;
    }

    return true;
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
    const { performer } = this.props;
    return (
      <>
        <div style={{ marginBottom: '25px' }}>
          <div className="text-at-the-top">
            {performer?.name || performer?.username}
            &apos;s availability in
            {' '}
            {moment(visisbleDate).format('MMMM YYYY')}
            {' '}
            Select a date to begin.
            <br />
            {success && total === 0 && 'Select date to book slot'}
          </div>

          <Calendar
            className="booking-calendar"
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
            <BookingEventModal
              submiting={submiting}
              visible={modalVisible}
              onCancel={this.handleCloseModal.bind(this)}
              selectedDate={selectedDate}
              availableSlots={availableSlots}
              onBooking={this.onBookingSlot.bind(this)}
              wrapClassName="model-booking-modal-wrapper"
            />
          )}
        </div>
      </>
    );
  }
}
