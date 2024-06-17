import { PureComponent } from 'react';
import {
  Layout, message, Tabs, Row, Col
} from 'antd';
import { connect } from 'react-redux';
import Head from 'next/head';
import {
  IUIConfig, IPerformer, ICountry, ILanguage
} from 'src/interfaces/';
import './edit-profile.less';
import { performerService } from '@services/index';
import { ModelProfileEditForm } from '@components/performer';
import ProfileImagesUploads from '@components/performer/profile-image-update';
import PerformeServicesFormEdit from '@components/performer/performer-service-form-edit';
import Router from 'next/router';
import { UpdatePaswordForm } from '@components/user/update-password-form';
import { updatePassword } from 'src/redux/user/actions';
import { getResponseError } from '@lib/utils';

const { TabPane } = Tabs;

interface IProps {
  ui: IUIConfig;
  id: string;
  countries?: ICountry[];
  languages?: ILanguage[];
  phoneCodes: any[];
  attributes: any;
  updatePassword: Function;
  updateSuccess: boolean;
  error: any;
}

interface IState {
  performer: IPerformer;
  submitting: boolean;
  loading: boolean;
  categories: any[];
  pwUpdating: boolean;
}

class editPerformersProfile extends PureComponent<IProps, IState> {
  static authenticate: boolean = true;

  static noredirect: boolean = true;

  state = {
    performer: {} as any,
    submitting: false,
    loading: false,
    pwUpdating: false,
    categories: [],
    limit: 500,
    offset: 0
  };

  componentDidMount() {
    this.getMyProfile();
    this.getCategoriesList();
  }

  componentDidUpdate(preProps: IProps) {
    const { error, updateSuccess } = this.props;
    if (error !== preProps.error) {
      message.error(getResponseError(error));
    }
    if (updateSuccess && updateSuccess !== preProps.updateSuccess) {
      message.success('Changes saved.');
    }
  }

  getMyProfile = async () => {
    try {
      await this.setState({ loading: true });
      const resp = await performerService.me();
      this.setState({ performer: resp.data });
      if (resp.data.status === 'waiting-for-review') {
        message.info('Your account is under for review, once done your profile will be shown for user end.', 10);
      }
    } catch {
      message.error('Error occured, please try again later');
      // TODO - redirect to home!
    } finally {
      this.setState({ loading: false });
    }
  }

  getCategoriesList = async () => {
    const { limit, offset } = this.state;
    try {
      await this.setState({ loading: true });
      const resp = await performerService.categoriesList({
        limit,
        offset: offset * limit
      });
      this.setState({ categories: resp.data.data });
    } catch {
      message.error('Error occured, please try again later');
    } finally {
      this.setState({ loading: false });
    }
  }

  updateProfile = async (values: any) => {
    try {
      await this.setState({ loading: true });
      await performerService.updateProfile(values);
      message.success('Updated successfully');
      Router.reload();
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'An error occurred, please try again!');
    } finally {
      this.setState({ loading: false });
    }
  }

  updateCurrency = async (values: any) => {
    try {
      await this.setState({ loading: true });
      await performerService.updateProfile(values);
      message.success('Currency updated');
    } catch (e) {
      const error = await e;
      message.error(error?.message || 'Currency update error, please try again!');
    } finally {
      this.setState({ loading: false });
    }
  }

  updatePassword(data: any) {
    const { updatePassword: handleUpdatePassword } = this.props;
    handleUpdatePassword(data.password);
  }

  render() {
    const {
      ui, phoneCodes, countries, languages, attributes
    } = this.props;
    const {
      performer,
      submitting,
      loading,
      categories,
      pwUpdating
    } = this.state;
    const {
      genders,
      heights,
      weights,
      eyes,
      hairColors,
      hairLengths,
      bustSizes,
      bustTypes,
      travels,
      ethnicities,
      orientations,
      provides,
      meetingWith,
      services,
      smokers,
      tattoos,
      currencies
    } = attributes;

    return (
      <>
        <Head>
          <title>
            {ui && ui.siteName}
            {' '}
            | Edit Profile
          </title>
        </Head>
        <Layout className="model-edit-profile-layout">
          <Row gutter={24}>
            <Col className="gutter-row" span={24}>
              <Tabs defaultActiveKey="general">
                <TabPane tab="General Info" key="general">
                  <ModelProfileEditForm
                    onFinish={this.updateProfile}
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
                    loading={loading}
                    submitting={submitting}
                    categories={categories}
                    currencies={currencies}
                  />
                </TabPane>
                <TabPane tab="Profile Images" key="images">
                  <ProfileImagesUploads />
                </TabPane>
                <TabPane tab="Services and Rate" key="services">
                  <PerformeServicesFormEdit performerId={performer?._id} currency={performer.currency} />
                </TabPane>
                <Tabs.TabPane tab="Change password" key="password">
                  <UpdatePaswordForm
                    onFinish={this.updatePassword.bind(this)}
                    updating={pwUpdating}
                  />
                </Tabs.TabPane>
              </Tabs>
            </Col>
          </Row>
        </Layout>
      </>
    );
  }
}

const mapStates = (state: any) => ({
  ui: { ...state.ui },
  attributes: state.settings.attributes,
  phoneCodes: state.settings.phoneCodes,
  countries: state.settings.countries,
  languages: state.settings.languages,
  updateSuccess: state.user.updateSuccess
});

const mapDispatch = { updatePassword };
export default connect(mapStates, mapDispatch)(editPerformersProfile);
