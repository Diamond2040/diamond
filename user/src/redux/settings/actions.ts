import { createAction } from '@lib/redux';

export const updateSettings = createAction('updateSettings');

export const loadInitialData = createAction('LOAD_INITIAL_DATA');

export const loadAttributesSuccess = createAction('LOAD_ATTRS_SUCCESS');

export const loadCountriesSuccess = createAction('LOAD_COUNTRIES_SUCCESS');

export const loadPhoncodesSuccess = createAction('LOAD_PHONE_CODES_SUCCESS');

export const loadLanguageSuccess = createAction('LOAD_LANGUAGES_SUCCESS');
