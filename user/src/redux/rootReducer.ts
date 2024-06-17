import { merge } from 'lodash';
import { combineReducers } from 'redux';

// load reducer here
import settings from './settings/reducers';
import ui from './ui/reducers';
import user from './user/reducers';
import auth from './auth/reducers';
import performer from './performer/reducers';
import comment from './comment/reducers';
import banner from './banner/reducers';
import system from './system/reducers';
import booking from './schedule-booking/reducers';
import message from './message/reducers';

const reducers = merge(
  settings,
  ui,
  user,
  auth,
  performer,
  comment,
  banner,
  system,
  booking,
  message
);

export default combineReducers(reducers);
