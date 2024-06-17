import { message } from 'antd';
import Page from '@components/common/layout/page';
import Head from 'next/head';
import { PureComponent } from 'react';
import { subscriptionPackageService } from 'src/services';
import { ISubscriptionPackageCreate } from 'src/interfaces';
import Router from 'next/router';
import { getResponseError } from '@lib/utils';
import { FormSubscriptionPackage } from '@components/subscription-package/form';
import { BreadcrumbComponent } from '@components/common';
import { connect } from 'react-redux';

interface IProps {
  settings: any;
}

interface IStates {
  submiting: boolean;
}

class SubscriptionPackageCreatePage extends PureComponent<IProps, IStates> {
  constructor(props) {
    super(props);
    this.state = { submiting: false };
  }

  async handleCreate(data: ISubscriptionPackageCreate) {
    try {
      await this.setState({ submiting: true });
      await subscriptionPackageService.create(data);
      message.success('Created successfully');
      Router.push('/subscription-package');
    } catch (e) {
      const err = Promise.resolve(e);
      message.error(getResponseError(err));
      this.setState({ submiting: false });
    }
  }

  render() {
    const { submiting } = this.state;
    return (
      <>
        <Head>
          <title>New Subscription Package</title>
        </Head>
        <div style={{ marginBottom: '16px' }}>
          <BreadcrumbComponent
            breadcrumbs={[{ title: 'Subscription Packages', href: '/subscription-package' }, { title: 'New subscription package' }]}
          />
        </div>
        <Page>
          <FormSubscriptionPackage onFinish={this.handleCreate.bind(this)} submiting={submiting} {...this.props} />
        </Page>
      </>
    );
  }
}
const mapStates = (state: any) => ({
  settings: state.settings
});

export default connect(mapStates)(SubscriptionPackageCreatePage);
