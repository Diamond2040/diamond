import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '@lib/redux';
import Router from 'next/router';
import { authService, userService } from 'src/services';
import {
  ILogin
} from 'src/interfaces';
import { message } from 'antd';
import { updateCurrentUser } from '../user/actions';
import {
  login,
  loginSuccess,
  logout,
  loginFail
} from './actions';

const authSagas = [
  {
    on: login,
    * worker(data: any) {
      try {
        const payload = data.payload as ILogin;
        const resp = (yield authService.login(payload)).data;
        // store token, update store and redirect to dashboard page
        yield authService.setToken(resp.token);
        const userResp = (yield userService.me()).data;
        yield put(updateCurrentUser(userResp));
        yield put(loginSuccess());
        Router.push('/home');
      } catch (e) {
        const error = yield Promise.resolve(e);
        message.error(error.message || 'Something went wrong, please try again');
        yield put(loginFail(error));
      }
    }
  },
  {
    on: logout,
    * worker() {
      try {
        yield authService.removeToken();
        localStorage.removeItem('checkSubscriptionAlert');
        message.success('Log out!');
        Router.push('/auth/login');
      } catch (e) {
        message.error('Something went wrong.');
      }
    }
  }
];

export default flatten([createSagas(authSagas)]);
