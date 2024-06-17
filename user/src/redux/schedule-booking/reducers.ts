import { merge } from 'lodash';
import { createReducers } from '@lib/redux';
import { IReduxAction } from 'src/interfaces';
import {
  addScheduleBooking, accessScheduleBooking, setScheduleBooking, dismissAllScheduleBooking
} from './actions';

const initialState = {
  data: [],
  total: 0
};

const reducers = [
  {
    on: addScheduleBooking,
    reducer(state: any, action: IReduxAction<any>) {
      return {
        ...state,
        data: [...state.data, action.payload]
      };
    }
  },
  {
    on: accessScheduleBooking,
    reducer(state: any, action: IReduxAction<string>) {
      return {
        ...state,
        data: state.data.filter((p) => p._id !== action.payload)
      };
    }
  },
  {
    on: setScheduleBooking,
    reducer(state: any, action: IReduxAction<any>) {
      return {
        ...state,
        data: action.payload
      };
    }
  },
  {
    on: dismissAllScheduleBooking,
    reducer(state) {
      return {
        ...state,
        data: [],
        total: 0
      };
    }
  }
];
export default merge({}, createReducers('scheduleBooking', [reducers], initialState));
