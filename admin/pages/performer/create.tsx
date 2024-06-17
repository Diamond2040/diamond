import Head from 'next/head';
import { PureComponent } from 'react';
import { message } from 'antd';
import Page from '@components/common/layout/page';
import {
  ICountry, ILangguges, IPhoneCodes, IAttribute
} from 'src/interfaces';
import Router from 'next/router';
import { performerService, utilsService, categoryService } from '@services/index';
import { AccountForm } from '@components/performer/AccountForm';
import { BreadcrumbComponent } from '@components/common';
import './index.less';

interface IProps {
  countries: ICountry[];
  languages: ILangguges[];
  phoneCodes: IPhoneCodes[];
}
interface IState {
  creating: boolean;
  genders: any[];
  heights: any[];
  weights: any[];
  eyes: IAttribute[];
  hairColors: IAttribute[];
  hairLengths: IAttribute[];
  bustSizes: IAttribute[];
  bustTypes: IAttribute[];
  travels: IAttribute[];
  ethnicities: IAttribute[];
  orientations: IAttribute[];
  provides: IAttribute[];
  meetingWith: IAttribute[];
  services: IAttribute[];
  smokers: IAttribute[];
  tattoos: IAttribute[];
  categories: any[];
  currencies: IAttribute[];
}

class PerformerCreate extends PureComponent<IProps, IState> {
  static async getInitialProps() {
    try {
      const [countries, languages, phoneCodes] = await Promise.all([
        utilsService.countriesList(),
        utilsService.languagesList(),
        utilsService.phoneCodesList()
      ]);
      return {
        countries: countries?.data || [],
        languages: languages?.data || [],
        phoneCodes: phoneCodes?.data || []
      };
    } catch (e) {
      return {
        countries: [],
        languages: [],
        phoneCodes: []
      };
    }
  }

  state = {
    creating: false,
    genders: [],
    heights: [],
    weights: [],
    eyes: [],
    hairColors: [],
    hairLengths: [],
    bustSizes: [],
    bustTypes: [],
    travels: [],
    ethnicities: [],
    orientations: [],
    provides: [],
    meetingWith: [],
    services: [],
    smokers: [],
    tattoos: [],
    categories: [],
    currencies: []
  };

  customFields = {};

  componentDidMount() {
    this.getAttributes();
    this.getCategories();
  }

  getCategories = async () => {
    try {
      const resp = await categoryService.search({
        group: 'performer',
        limit: 500,
        status: 'active'
      });
      this.setState({
        categories: resp.data.data
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error on load categories');
    }
  };

  getAttributes = async () => {
    const resp = await utilsService.allAttributes();

    const { data } = resp;
    this.setState({
      bustTypes: data.filter((d) => d.group === 'bustType'),
      bustSizes: data.filter((d) => d.group === 'bustSize'),
      travels: data.filter((d) => d.group === 'travel'),
      ethnicities: data.filter((d) => d.group === 'ethnicity'),
      orientations: data.filter((d) => d.group === 'orientation'),
      provides: data.filter((d) => d.group === 'provide'),
      meetingWith: data.filter((d) => d.group === 'meetingWith'),
      heights: data.filter((d) => d.group === 'height'),
      weights: data.filter((d) => d.group === 'weight'),
      services: data.filter((d) => d.group === 'service'),
      eyes: data.filter((d) => d.group === 'eyes'),
      hairColors: data.filter((d) => d.group === 'hairColor'),
      hairLengths: data.filter((d) => d.group === 'hairLength'),
      smokers: data.filter((d) => d.group === 'smoker'),
      tattoos: data.filter((d) => d.group === 'tattoo'),
      genders: data.filter((d) => d.group === 'gender'),
      currencies: data.filter((d) => d.group === 'currency')
    });
  };

  async submit(data: any) {
    try {
      if (data.password !== data.confirmPassword) {
        message.error('Confirm password mismatch!');
        return;
      }
      await this.setState({ creating: true });
      const resp = await performerService.create({
        ...data,
        ...this.customFields
      });
      message.success('Created success');
      Router.replace(
        { pathname: '/performer/update', query: { id: resp.data._id } },
        `/performer/update?id=${resp.data._id}`
      );
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'An error occurred, please try again!');
    } finally {
      this.setState({ creating: false });
    }
  }

  render() {
    const {
      creating,
      genders = [],
      heights = [],
      weights = [],
      eyes = [],
      hairColors = [],
      hairLengths = [],
      bustSizes = [],
      bustTypes = [],
      travels = [],
      ethnicities = [],
      orientations = [],
      provides = [],
      meetingWith = [],
      services = [],
      smokers = [],
      tattoos = [],
      categories = [],
      currencies = []
    } = this.state;
    const { countries, languages, phoneCodes } = this.props;

    return (
      <>
        <Head>
          <title>New Performer</title>
        </Head>
        <BreadcrumbComponent breadcrumbs={[{ title: 'Performers', href: '/performer' }, { title: 'New performer' }]} />
        <Page>
          <AccountForm
            onFinish={this.submit.bind(this)}
            countries={countries}
            languages={languages}
            heights={heights}
            weights={weights}
            phoneCodes={phoneCodes}
            services={services}
            eyes={eyes}
            hairColors={hairColors}
            hairLengths={hairLengths}
            bustSizes={bustSizes}
            bustTypes={bustTypes}
            travels={travels}
            ethnicities={ethnicities}
            orientations={orientations}
            provides={provides}
            meetingWith={meetingWith}
            genders={genders}
            smokers={smokers}
            tattoos={tattoos}
            categories={categories}
            submitting={creating}
            currencies={currencies}
          />
        </Page>
      </>
    );
  }
}

export default PerformerCreate;
