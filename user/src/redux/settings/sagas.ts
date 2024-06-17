import { flatten } from 'lodash';
import { put } from 'redux-saga/effects';
import { createSagas } from '@lib/redux';
import { utilsService } from '@services/utils.service';
import {
  loadAttributesSuccess,
  loadCountriesSuccess,
  loadInitialData,
  loadLanguageSuccess,
  loadPhoncodesSuccess
} from './actions';

const settingSagas = [
  {
    on: loadInitialData,
    * worker() {
      try {
        // attributes
        const attrResp = yield utilsService.allAttributes();
        yield put(loadAttributesSuccess(attrResp.data));

        // countries
        const countryResp = yield utilsService.countriesList();
        yield put(loadCountriesSuccess(countryResp.data));
        // languages
        const langResp = yield utilsService.languagesList();
        yield put(loadLanguageSuccess(langResp.data));
        // phone code
        const phoneCode = yield utilsService.phoneCodesList();
        yield put(loadPhoncodesSuccess(phoneCode.data));
      } catch (e) {
        yield Promise.resolve(e);
      }
    }
  }
];

export default flatten([createSagas(settingSagas)]);
