import { ICountry } from './utils';

export interface IUIConfig {
  collapsed: boolean;
  theme: string;
  siteName: string;
  logo: string;
  fixedHeader: boolean;
  menus: any[];
  favicon: string;
  loginPlaceholderImage?: string;
  footerContent: string;
  countries: ICountry[];
  welcomeTitle: string;
  welcomeContent: string;
  welcomeImage: string;
  homeTitle: string;
  homeContent: string;
  homeImage: string;
  contactContent: string;
  currencySymbol: string;
}
