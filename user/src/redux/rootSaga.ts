import { all, spawn } from 'redux-saga/effects';

import userSagas from './user/sagas';
import authSagas from './auth/sagas';
import performerSagas from './performer/sagas';
import commentSagas from './comment/sagas';
import bannerSagas from './banner/sagas';
import systemSagas from './system/sagas';
import settingSagas from './settings/sagas';
import messageSagas from './message/sagas';

function* rootSaga() {
  yield all(
    [
      ...authSagas,
      ...userSagas,
      ...performerSagas,
      ...commentSagas,
      ...bannerSagas,
      ...systemSagas,
      ...settingSagas,
      ...messageSagas
    ].map(spawn)
  );
}

export default rootSaga;
