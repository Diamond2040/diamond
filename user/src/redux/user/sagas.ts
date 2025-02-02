import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '@lib/redux';
import { userService, authService } from '@services/index';
import { IReduxAction } from 'src/interfaces';
import {
  updateUser,
  updateUserSuccess,
  updateUserFail,
  setUpdating,
  updatePassword,
  updatePasswordSuccess,
  updatePasswordFail
} from './actions';

const userSagas = [
  // TODO - defind update current user or get from auth user info to reload current user data if needed
  {
    on: updateUser,
    * worker(data: IReduxAction<any>) {
      try {
        yield put(setUpdating(true));
        const updated = yield userService.updateMe(data.payload);
        yield put(updateUserSuccess(updated.data));
      } catch (e) {
        // TODO - alert error
        const error = yield Promise.resolve(e);
        yield put(updateUserFail(error));
      } finally {
        yield put(setUpdating(false));
      }
    }
  },
  {
    on: updatePassword,
    * worker(data: IReduxAction<any>) {
      try {
        yield put(setUpdating(true));
        const updated = yield authService.updatePassword(data.payload);
        yield put(updatePasswordSuccess(updated.data));
      } catch (e) {
        // TODO - alert error
        const error = yield Promise.resolve(e);
        yield put(updatePasswordFail(error));
      } finally {
        yield put(setUpdating(false));
      }
    }
  }
];

export default flatten([createSagas(userSagas)]);
