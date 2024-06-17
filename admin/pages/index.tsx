import Head from 'next/head';
import {
  Row, Col, Statistic, Card
} from 'antd';
import { PureComponent } from 'react';
import { utilsService } from '@services/utils.service';
import {
  BarChartOutlined,
  DotChartOutlined, LineChartOutlined, DollarOutlined
} from '@ant-design/icons';
import Link from 'next/link';

export default class Dashboard extends PureComponent<any> {
  state = {
    stats: {
      totalActiveUsers: 0,
      totalInactiveUsers: 0,
      totalPerformers: 0,
      totalPendingPerformers: 0,
      totalMoneyEarnings: 0
    }
  }

  async componentDidMount() {
    try {
      const stats = await (await utilsService.statistics()).data;
      if (stats) {
        this.setState({ stats });
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(await e);
    }
  }

  render() {
    const { stats } = this.state;
    return (
      <>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Row gutter={24} className="dashboard-stats">
          <Col span={8}>
            <Link href="/users?status=active">
              <a>
                <Card>
                  <Statistic
                    title="Active USERS"
                    value={stats.totalActiveUsers}
                    valueStyle={{ color: '#ffc107' }}
                    prefix={<LineChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/users?status=inactive">
              <a>
                <Card>
                  <Statistic
                    title="INACTIVE USERS"
                    value={stats.totalInactiveUsers}
                    valueStyle={{ color: '#ffc107' }}
                    prefix={<LineChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/performer">
              <a>
                <Card>
                  <Statistic
                    title="TOTAL ESCORTS"
                    value={stats.totalPerformers}
                    valueStyle={{ color: '#009688' }}
                    prefix={<BarChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/performer?status=waiting-for-review">
              <a>
                <Card>
                  <Statistic
                    title="PENDING ESCORTS"
                    value={stats.totalPendingPerformers}
                    valueStyle={{ color: '#009688' }}
                    prefix={<DotChartOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
          <Col span={8}>
            <Link href="/payment-history">
              <a>
                <Card>
                  <Statistic
                    title="TOTAL EARNED"
                    value={stats.totalMoneyEarnings}
                    valueStyle={{ color: 'red' }}
                    prefix={<DollarOutlined />}
                  />
                </Card>
              </a>
            </Link>
          </Col>
        </Row>
      </>
    );
  }
}
