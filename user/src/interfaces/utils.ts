export interface ISearch {
  q?: string;
  limit?: number;
  offset?: number;
}

export interface ICountry {
  name: string;
  code: string;
  flag: string;
}

export interface ILanguage {
  name: string;
  code: string;
}

export interface IPhoneCodes {
  name: string;
  code: string;
  dialCode: string;
  countryCode: string;
}

export interface IAttribute {
  key: string;
  value: string;
  group: string;
}
