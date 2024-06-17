import Head from 'next/head';
import { PureComponent } from 'react';
import {
  Col, message, Row, Tabs, Form
} from 'antd';
import { IdcardOutlined, FileProtectOutlined } from '@ant-design/icons';
import Page from '@components/common/layout/page';
import { AccountForm } from '@components/performer/AccountForm';
import {
  ICountry, ILangguges, IPerformer, IAttribute
} from 'src/interfaces';
import { performerService, categoryService } from '@services/index';
import { utilsService } from '@services/utils.service';
import { BreadcrumbComponent } from '@components/common';
import './index.less';
import ProfileImagesUploads from '@components/performer/profile-images-uploader';
import PerformerServiceFormEdit from '@components/performer/performer-service-form-edit';
import Router from 'next/router';

const { TabPane } = Tabs;

interface IProps {
  loading: boolean;
  id: string;
  userId: string;
  countries?: ICountry[];
  languages?: ILangguges[];
  phoneCodes: any[];
}

interface IState {
  loading: boolean;
  performer: IPerformer;
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
  currencies: IAttribute[];
  categories: any[];
  attributes: any;
}
class PerformerUpdate extends PureComponent<IProps, IState> {
  static async getInitialProps({ ctx }) {
    const [countries, languages, phoneCodes] = await Promise.all([
      utilsService.countriesList(),
      utilsService.languagesList(),
      utilsService.phoneCodesList()
    ]);
    const { query } = ctx;
    return {
      countries: countries?.data || [],
      languages: languages?.data || [],
      phoneCodes: phoneCodes?.data || [],
      id: query.id,
      userId: query.userId
    };
  }

  state = {
    loading: false,
    performer: {} as IPerformer,
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
    attributes: {},
    currencies: []
  };

  componentDidMount() {
    this.getAttributes();
    this.getPerformer();
    this.getCategories();
  }

  getAttributes = async () => {
    // attributes
    const resp = await utilsService.allAttributes();

    const { data } = resp;
    const attributes = {
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
      currencies: data.filter((d) => d.group === 'currency'),
      time: data.filter((d) => d.group === 'time')
    } as any;
    this.setState({
      ...attributes,

      attributes
    });
  };

  getPerformer = async () => {
    const { id, userId } = this.props;
    const { data: performer } = userId ? await performerService.findByUserId(userId) : await performerService.findById(id);
    this.setState({
      performer
    });
  };

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

  async submit(data: any) {
    const { performer } = this.state;
    try {
      await this.setState({ loading: true });
      await performerService.update(performer._id, data);
      message.success('Updated successfully');
      await this.setState({ loading: false });
      Router.reload();
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'An error occurred, please try again!');
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      loading,
      performer,
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
      currencies = [],
      attributes = {}
    } = this.state;

    const { countries, languages, phoneCodes = [] } = this.props;
    return (
      <>
        <Head>
          <title>
            {`${performer?.name || performer?.username || ''}`}
            {' '}
            update
          </title>
        </Head>
        <BreadcrumbComponent
          breadcrumbs={[
            { title: 'Models', href: '/model' },
            { title: performer?.name || performer?.username || '' },
            { title: 'Update' }
          ]}
        />
        <Page>
          <Tabs defaultActiveKey="general-info">
            <TabPane tab="General info" key="general-info">
              {performer && (
                <AccountForm
                  performer={performer}
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
                  submitting={loading}
                  currencies={currencies}
                  onFinish={this.submit.bind(this)}
                />
              )}
            </TabPane>
            <TabPane tab="Profile images" key="images">
              <ProfileImagesUploads performerId={performer?._id} />
            </TabPane>
            <TabPane tab="Rates and Services" key="rates">
              <PerformerServiceFormEdit
                performerId={performer?._id}
                attributes={attributes}
                currency={performer.currency}
              />
            </TabPane>
            <TabPane tab="Documents" key="documents">
              <Row>
                <Col md={24}>
                  <Form.Item name="name" label="ID verification">
                    {performer?.idVerification?.url ? (
                      <a href={performer?.idVerification?.url} target="_blank" rel="noreferrer">
                        <IdcardOutlined style={{ fontSize: '48px' }} />
                      </a>
                    ) : (
                      <p>No data</p>
                    )}
                  </Form.Item>
                </Col>
                <Col md={24}>
                  <Form.Item name="name" label="Document verification">
                    {performer?.documentVerification?.url ? (
                      <a href={performer?.documentVerification?.url} target="_blank" rel="noreferrer">
                        <FileProtectOutlined style={{ fontSize: '48px' }} />
                      </a>
                    ) : (
                      <p>No data</p>
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Page>
      </>
    );
  }
}

export default PerformerUpdate;
