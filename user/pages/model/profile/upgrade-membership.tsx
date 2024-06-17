import {
  Layout,
  message,
  Spin,
  Row,
  Col,
  Divider,
  Tooltip,
  Button
} from 'antd';
import moment from 'moment';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import Head from 'next/head';
import { ISubscriptionPackage, IUIConfig, IUser } from 'src/interfaces';
import { getResponseError } from '@lib/utils';
import { subscriptionService, paymentService } from '@services/index';
import { PackageGridCard } from '@components/subscription/grid-card';
import Router from 'next/router';
import './upgrade-membership.less';
import { capitalizeFirstLetter } from '@lib/string';

interface IProps {
  ui: IUIConfig;
  user: IUser;
}

class UpgradeMembershipPlan extends PureComponent<IProps> {
  static authenticate: boolean = true;

  state = {
    currentLoading: true,
    currentSubscription: null,
    activePackageId: '',
    fetching: false,
    submiting: false,
    packages: [],
    step: 1
  };

  componentDidMount() {
    const { query } = Router;
    if (query && query.packageId) {
      this.setState({ activePackageId: query.packageId });
    }
    this.getPackages();
    this.getCurrent();
  }

  getCurrent = async () => {
    try {
      const { data } = await subscriptionService.current();
      this.setState({
        currentSubscription: data,
        currentLoading: false
      });
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    }
  };

  cancelSubscription = async () => {
    try {
      if (!window.confirm('Are you sure you want to cancel?')) {
        message.success('Thank you!');
        return;
      }
      await subscriptionService.cancelSubscription();
      message.success('subscription has been deactivated');
      window.location.reload();
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    }
  };

  handleUpgrade = async (data: ISubscriptionPackage) => {
    try {
      const { currentSubscription } = this.state;
      if (
        currentSubscription?.membershipType === 'basic'
        && data.membershipType === 'basic'
      ) {
        message.info('You already have an active basic subscription');
        return;
      }
      if (
        currentSubscription?.membershipType === 'basic'
        && data.membershipType === 'premium'
      ) {
        message.info(
          'You have an active basic subscription. Please cancel the same and wait until expiration to opt for a premium subscription'
        );
        return;
      }

      if (
        currentSubscription?.membershipType === 'premium'
        && data.membershipType === 'basic'
      ) {
        message.info(
          'You have an active premium subscription. Please cancel the same and wait until expiration if you would like to opt for a basic subscription'
        );
        return;
      }
      if (
        currentSubscription?.membershipType === 'premium'
        && data.membershipType === 'premium'
      ) {
        message.info(
          'You already have an active premium subscription. To change to a different premium package, please cancel the existing subscription and wait until the expiration'
        );
        return;
      }

      await this.setState({ submiting: true, step: 2 });
      const resp = await paymentService.subscribe({ packageId: data._id });
      if (resp.data && resp.data.paymentUrl) {
        window.location.href = resp.data.paymentUrl;
      }
    } catch (e) {
      const error = await Promise.resolve(e);
      message.error(getResponseError(error));
    } finally {
      this.setState({ submiting: false });
    }
  };

  getPackages = async () => {
    try {
      await this.setState({ fetching: true });
      const resp = await (
        await subscriptionService.searchPackage({
          limit: 99,
          sortBy: 'ordering',
          sort: 'asc'
        })
      ).data;
      this.setState({ packages: resp.data, fetching: false });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured, please try again later');
      this.setState({ fetching: false });
    }
  };

  renderCurrentSubscription = () => {
    const { currentSubscription, currentLoading } = this.state;
    if (currentLoading) return null;

    return (
      <div className="form-container">
        <h3 className="info-title">Current membership info</h3>

        <div className="params">
          {currentSubscription?.status === 'active' && (
            <>
              <p>
                {currentSubscription?.subscriptionType !== 'system' && (
                  <span>
                    Current Package:
                    {' '}
                    <strong>
                      {currentSubscription.packageName || 'Basic'}
                    </strong>
                  </span>
                )}
                <span>
                  Membership:
                  {' '}
                  <strong>
                    {capitalizeFirstLetter(currentSubscription.membershipType || 'Basic')}
                  </strong>
                </span>
                {currentSubscription?.subscriptionType && (
                <span>
                  Subscription Type:
                  {' '}
                  <strong>{capitalizeFirstLetter(currentSubscription?.subscriptionType)}</strong>
                </span>
                )}
                {currentSubscription?.expiredAt && (
                  <span>
                    Expired At:
                    {' '}
                    <strong>
                      {moment(currentSubscription?.expiredAt).format(
                        'YYYY-MM-DD'
                      )}
                    </strong>
                  </span>
                )}
                {currentSubscription?.nextRecurringDate
                  && currentSubscription?.subscriptionType === 'recurring' && (
                    <span>
                      Renew on:
                      {' '}
                      <strong>
                        {moment(currentSubscription?.nextRecurringDate).format(
                          'YYYY-MM-DD'
                        )}
                      </strong>
                    </span>
                )}
              </p>

              {currentSubscription?.membershipType === 'basic' && (
                <p>
                  To get listed as a premium escort and increase your bookings,
                  please cancel the active basic subscription and opt for one of
                  the premium packages.
                </p>
              )}

              <p>
                <Button onClick={this.cancelSubscription}>
                  Cancel subscription
                </Button>
              </p>
            </>
          )}
        </div>
        {(!currentSubscription
          || currentSubscription?.status === 'deactivated') && (
          <div>
            <strong>
              Get listed and start receiving bookings by subscribing to any of
              the Basic packages below. You can also become a Premium escort and
              get higher number of bookings than others by choosing a premium
              package.
            </strong>
          </div>
        )}
      </div>
    );
  };

  renderPackages = () => {
    const {
      packages, fetching, step, submiting, activePackageId
    } = this.state;

    const basicPackages = packages.filter((p) => p?.membershipType === 'basic');
    const premiumPackages = packages.filter(
      (p) => p?.membershipType === 'premium'
    );

    return (
      <div className="form-container">
        <h3 className="info-title">Select your membership package</h3>
        <Divider className="register-steps">
          <Tooltip title="Choose your membership plan">
            <span
              aria-hidden
              className={step > 0 ? 'step-box active' : 'step-box'}
              onClick={() => this.setState({ step: 1 })}
            >
              1
            </span>
          </Tooltip>
          <Tooltip title="Payment">
            <span className={step === 3 ? 'step-box active' : 'step-box'}>
              2
            </span>
          </Tooltip>
        </Divider>
        {!fetching && step === 1 && (
          <div className="packages-li">
            <h2 className="title-package">BASIC PACKAGES</h2>
            <Row>
              {basicPackages.length > 0 ? (
                basicPackages.map((p: ISubscriptionPackage) => (
                  <Col lg={6} md={12} xs={24} key={p._id}>
                    <PackageGridCard
                      isActive={activePackageId && activePackageId === p._id}
                      onSelect={this.handleUpgrade.bind(this, p)}
                      item={p}
                      submiting={submiting}
                      // currencySymbol={ui.currencySymbol}
                    />
                  </Col>
                ))
              ) : (
                <div className="title-package">
                  No basic subscription package was found
                </div>
              )}
            </Row>
            <h2 className="title-package">PREMIUM PACKAGES</h2>
            <Row>
              {premiumPackages.length > 0 ? (
                premiumPackages.map((p: ISubscriptionPackage) => (
                  <Col lg={6} md={12} xs={24} key={p._id}>
                    <PackageGridCard
                      isActive={activePackageId && activePackageId === p._id}
                      onSelect={this.handleUpgrade.bind(this, p)}
                      item={p}
                      submiting={submiting}
                      // currencySymbol={ui.currencySymbol}
                    />
                  </Col>
                ))
              ) : (
                <div className="text-center">
                  No premium subscription package was found
                </div>
              )}
            </Row>
          </div>
        )}
        {fetching && step === 1 && (
          <div className="text-center">
            <Spin />
          </div>
        )}
        {step === 2 && (
          <div className="text-center">
            <h4>
              Redirecting to payment gateway, do not reload page at this time.
            </h4>
            <Spin />
          </div>
        )}
      </div>
    );
  };

  render() {
    const { ui } = this.props;
    const { currentLoading } = this.state;
    return (
      <Layout>
        <Head>
          <title>{`${ui.siteName} | Upgrade membership plan`}</title>
        </Head>
        <div className="main-container membership-container">
          <div className="register-box custom">
            <div className="page-heading">
              <span className="box">MEMBERSHIP PLAN</span>
            </div>

            {this.renderCurrentSubscription()}

            {!currentLoading && this.renderPackages()}
          </div>
        </div>
      </Layout>
    );
  }
}
const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  user: { ...state.user.current }
});

const mapDispatchToProps = {};

export default connect(
  mapStatesToProps,
  mapDispatchToProps
)(UpgradeMembershipPlan);
