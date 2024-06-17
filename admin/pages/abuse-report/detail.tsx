import {
  Layout, message, PageHeader, Row, Col, Tag
} from 'antd';
import Head from 'next/head';
import { PureComponent } from 'react';
import { IAbuseReport } from 'src/interfaces';
import { BreadcrumbComponent } from '@components/common/breadcrumb';
import Page from '@components/common/layout/page';
import { abuseReportService } from 'src/services';
import { getResponseError } from '@lib/utils';
import { formatDate } from 'src/lib/date';
import { capitalizeFirstLetter } from '@lib/string';

const { Content } = Layout;

interface IProps {
  id: string;
}

interface IStates {
  abuseReport: IAbuseReport;
  loading: boolean;
}

class VideoAbuseReportDetailPage extends PureComponent<IProps, IStates> {
  static authenticate = true;

  static onlyPerformer = true;

  static async getInitialProps({ ctx }) {
    return ctx.query;
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      abuseReport: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getData();
  }

  async getData() {
    try {
      this.setState({ loading: true });
      const { id } = this.props;
      const resp = await abuseReportService.detail(id);
      this.setState({
        abuseReport: resp.data
      });
    } catch (e) {
      const err = await Promise.resolve(e);
      message.error(getResponseError(err));
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { abuseReport, loading } = this.state;
    return (
      <Layout>
        <Head>
          <title>Performer report details</title>
        </Head>
        <Content>
          <div className="main-container">
            <BreadcrumbComponent
              breadcrumbs={[
                { title: 'Performer report', href: '/abuse-report' },
                {
                  title: abuseReport?._id || 'Report details'
                }
              ]}
            />
            {abuseReport && !loading ? (
              <Page>
                <PageHeader title="Report details" />
                <Row>
                  <Col xs={24} md={24}>
                    <div className="ant-table">
                      <table>
                        <tbody>
                          <tr>
                            <td>Reporter:</td>
                            <td>{abuseReport.sourceInfo.username}</td>
                          </tr>
                          {/* <tr>
                            <td>Type</td>
                            <td>
                              <Tag color="red">
                                {capitalizeFirstLetter(abuseReport.type)}
                              </Tag>
                            </td>
                          </tr> */}
                          <tr>
                            <td>Escort:</td>
                            <td>
                              {abuseReport.targetInfo?.name
                                || abuseReport.targetInfo?.title
                                || 'N/A'}
                            </td>
                          </tr>
                          <tr>
                            <td>Reported on:</td>
                            <td>{formatDate(abuseReport.createdAt)}</td>
                          </tr>
                          <tr>
                            <td>Description:</td>
                            <td style={{ whiteSpace: 'pre-line' }}>{abuseReport.comment}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </Col>
                </Row>
              </Page>
            ) : (
              <p>Abuse report not found.</p>
            )}
          </div>
        </Content>
      </Layout>
    );
  }
}

export default VideoAbuseReportDetailPage;
