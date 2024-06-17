import { merge } from 'lodash';
import { createReducers } from '@lib/redux';
import {
  loadAttributesSuccess, loadCountriesSuccess, loadLanguageSuccess, loadPhoncodesSuccess, updateSettings
} from './actions';

// TODO -
const initialState = {
  attributes: {},
  countries: [],
  languages: [],
  phoneCodes: []
};

const settingReducers = [
  {
    on: updateSettings,
    reducer(state: any, data: any) {
      return {
        ...state,
        ...data.payload
      };
    }
  },
  {
    on: loadAttributesSuccess,
    reducer(state: any, data: any) {
      const { payload } = data;
      // load default attributes to this
      const attributes = {
        bustTypes: payload.filter((d) => d.group === 'bustType'),
        bustSizes: payload.filter((d) => d.group === 'bustSize'),
        travels: payload.filter((d) => d.group === 'travel'),
        ethnicities: payload.filter((d) => d.group === 'ethnicity'),
        orientations: payload.filter((d) => d.group === 'orientation'),
        provides: payload.filter((d) => d.group === 'provide'),
        meetingWith: payload.filter((d) => d.group === 'meetingWith'),
        heights: payload.filter((d) => d.group === 'height'),
        weights: payload.filter((d) => d.group === 'weight'),
        services: payload.filter((d) => d.group === 'service'),
        eyes: payload.filter((d) => d.group === 'eyes'),
        hairColors: payload.filter((d) => d.group === 'hairColor'),
        hairLengths: payload.filter((d) => d.group === 'hairLength'),
        smokers: payload.filter((d) => d.group === 'smoker'),
        tattoos: payload.filter((d) => d.group === 'tattoo'),
        genders: payload.filter((d) => d.group === 'gender'),
        currencies: payload.filter((d) => d.group === 'currency'),
        time: payload.filter((d) => d.group === 'time')
      };

      return {
        ...state,
        attributes
      };
    }
  },
  {
    on: loadCountriesSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        countries: data.payload
      };
    }
  },
  {
    on: loadLanguageSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        languages: data.payload
      };
    }
  },
  {
    on: loadPhoncodesSuccess,
    reducer(state: any, data: any) {
      return {
        ...state,
        phoneCodes: data.payload
      };
    }
  }
];

export default merge({}, createReducers('settings', [settingReducers], initialState));
