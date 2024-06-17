import { PureComponent } from 'react';
import { cookieService, userService } from '@services/index';
import BlankLayout from './blank-layout';
import AuthLayout from './auth-layout';
import PrimaryLayout from './primary-layout';
import MaintenaceLayout from './maintenance-layout';
import GEOLayout from './geoBlocked-layout';
import PublicLayout from './public-layout';

interface DefaultProps {
  children: any;
  layout: string;
  maintenance: boolean;
}

const LayoutMap = {
  geoBlock: GEOLayout,
  maintenance: MaintenaceLayout,
  primary: PrimaryLayout,
  public: PublicLayout,
  blank: BlankLayout,
  auth: AuthLayout
};

export default class BaseLayout extends PureComponent<DefaultProps> {
  state = {
    geoBlocked: false
  };

  async componentDidMount() {
    const checkGeo = cookieService.getCookie('checkGeoBlock');
    checkGeo === 'true' && this.setState({ geoBlocked: true });
    if (!checkGeo) {
      const checkBlock = await userService.checkCountryBlock();
      cookieService.setCookie('checkGeoBlock', 'false', 5);
      if (checkBlock?.data?.blocked) {
        cookieService.setCookie('checkGeoBlock', 'true', 5);
        this.setState({ geoBlocked: true });
      }
    }
  }

  render() {
    const {
      children,
      layout,
      maintenance
    } = this.props;
    const { geoBlocked } = this.state;

    // eslint-disable-next-line no-nested-ternary
    const Container = maintenance ? LayoutMap.maintenance : geoBlocked ? LayoutMap.geoBlock : layout && LayoutMap[layout] ? LayoutMap[layout] : LayoutMap.primary;
    return (
      <Container>{children}</Container>
    );
  }
}
