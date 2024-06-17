/* eslint-disable react/no-danger */
import moment from 'moment';
import Head from 'next/head';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { truncate } from 'lodash';
import {
  Layout, Row, Col, Button, Tag, message
} from 'antd';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import { connect, useSelector } from 'react-redux';
import { performerService } from 'src/services';
import Review from '@components/reviews';
import { IPerformer, IUIConfig } from 'src/interfaces';
import { ProfileImagesCarousel, RelatedProfiles } from '@components/performer';
import ProfileContact from '@components/performer/profile-contact';
import { ProfileRates } from '@components/performer/profile-rates';
import '@components/performer/performer.less';
import './index.less';
import { PerformeServicesList } from '@components/performer/peformer-services-list';
import { getYtbEmbeddedLink } from '@lib/utils';
import { VideoPopUp } from '@components/video-popup/video-popup';
import Link from 'next/link';

interface IProps {
  ui: IUIConfig;
  performer: IPerformer;
  attributes: any;
}

function redirect404(ctx: any) {
  if (process.browser) {
    Router.replace('/');
    message.error('The model account has been deactivated');
    return;
  }

  ctx.res.writeHead && ctx.res.writeHead(302, { Location: '/' });
  ctx.res.end && ctx.res.end();
}

function PerformerProfile({ performer, ui, attributes }: IProps) {
  const [details, setDetails] = useState({} as any);
  const [serviceSettings, setServiceSettings] = useState([]);
  const [rateSettings, setRateSettings] = useState([]);
  const [displayMode, setDisplayMode] = useState(false);
  const loggedIn = useSelector((state: any) => state.auth.loggedIn);
  const currentUser = useSelector((state: any) => state.user.current);
  const loadSettings = async (p) => {
    try {
      const { data } = await performerService.loadSettings(p._id);
      const service = data.find((d) => d.group === 'services');
      if (service) setServiceSettings(service.settings);

      const rate = data.find((d) => d.group === 'rates');
      if (rate) setRateSettings(rate.settings);

    // eslint-disable-next-line no-empty
    } catch (e) {
    }
  };

  const escapeHtml = (unsafe) => (unsafe || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n\s*\n/g, '\n')
    // new line to br
    .replace(/(\r\n|\n|\r)/gm, '<br>');

  const getAge = (date) => moment().diff(date, 'years');

  useEffect(() => {
    const mapData = performerService.mapWithAttributes(performer, attributes);
    setDetails(mapData);
  }, [performer, attributes]);

  useEffect(() => {
    if (performer) loadSettings(performer);
  }, [performer]);
  const print = (attrData) => {
    if (Array.isArray(attrData)) return attrData.join('; ');
    return attrData;
  };

  const scrollDownToReviewList = () => {
    document.getElementById('review-list').scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <Layout className="model-details-layout">
      <Head>
        <title>
          {`${ui?.siteName} | ${performer?.username || 'Loading...'}`}
        </title>
        <meta
          name="keywords"
          content={`${details?.username}, ${details?.name}`}
        />
        <meta name="description" content={truncate(details?.bio)} />
        {/* OG tags */}
        <meta
          property="og:title"
          content={`${ui?.siteName} | ${details?.username}`}
          key="title"
        />
        <meta
          property="og:image"
          content={details?.avatar || '/no-avatar.png'}
        />
        <meta
          property="og:keywords"
          content={`${details?.username}, ${details?.name}`}
        />
        <meta property="og:description" content={truncate(details?.bio)} />
      </Head>
      <Row className="profile-details">
        <Col lg={18} md={16} sm={24} xs={24}>
          <h1 className="card-title">{details?.name || details?.username}</h1>
          <p className="last-seen">
            Last seen:
            {' '}
            {details.offlineAt && (
            <span>
              {moment(details.offlineAt).format('DD/MM/YYYY HH:mm')}
            </span>
            )}
          </p>
          <div className="form-container">
            {false && getYtbEmbeddedLink(details.introVideoLink) && (
            <VideoPopUp
              getYtbEmbeddedLink={getYtbEmbeddedLink}
              introVideoLink={details.introVideoLink}
            />
            )}
            <p
              className={!displayMode && 'hidden'}
              dangerouslySetInnerHTML={{
                __html: escapeHtml(details.aboutMe || '')
              }}
            />
            <span onClick={() => setDisplayMode(!displayMode)} className="display-mode" aria-hidden>
              {!displayMode ? <DownCircleOutlined /> : <UpCircleOutlined />}
            </span>
          </div>

          <Row>
            <Col lg={12} md={12} sm={24} xs={24}>
              <ProfileImagesCarousel performerId={performer._id} />
            </Col>
            <Col lg={12} md={12} sm={24} xs={24}>
              <div className="form-container">
                <h1 className="info-title">My details</h1>
                <div className="params">
                  <div>
                    <span>Gender: </span>
                    <strong>{print(details.gender)}</strong>
                  </div>
                  <div>
                    <span>Age: </span>
                    <strong>{getAge(details.dateOfBirth)}</strong>
                  </div>
                  <div>
                    <span>Eyes: </span>
                    <strong>{print(details.eyes)}</strong>
                  </div>
                  <div>
                    <span>Hair color: </span>
                    <strong>{print(details.hairColor)}</strong>
                  </div>
                  <div>
                    <span>Hair length: </span>
                    <strong>{print(details.hairLength)}</strong>
                  </div>
                  <div>
                    <span>Bust size: </span>
                    <strong>{print(details.bustSize)}</strong>
                  </div>
                  <div>
                    <span>Bust type: </span>
                    <strong>{print(details.bustType)}</strong>
                  </div>
                  <div>
                    <span>Travels: </span>
                    <strong>{print(details.travels)}</strong>
                  </div>
                  <div>
                    <span>Weight: </span>
                    <strong>{print(details.weight)}</strong>
                  </div>
                  <div>
                    <span>Height: </span>
                    <strong>{print(details.height)}</strong>
                  </div>
                  <div>
                    <span>Ethnicity: </span>
                    <strong>{print(details.ethnicity)}</strong>
                  </div>
                  <div>
                    <span>Orientation: </span>
                    <strong>{print(details.orientation)}</strong>
                  </div>
                  <div>
                    <span>Smoker: </span>
                    <strong className="uppercase">{print(details.smoker)}</strong>
                  </div>
                  <div>
                    <span>Tattoo: </span>
                    <strong className="uppercase">{print(details.tattoo)}</strong>
                  </div>
                  <div>
                    <span>Nationality: </span>
                    <strong>{details.country}</strong>
                  </div>
                  <div className="tagColor">
                    <span>Languages: </span>
                    {details.languages?.map((m) => (<strong><Tag color="#242424">{print(m)}</Tag></strong>))}
                  </div>
                  <div className="tagColor">
                    <span>Services: </span>
                    {details.services?.map((ser) => (<strong><Tag color="#242424">{print(ser)}</Tag></strong>))}
                  </div>
                  <div>
                    <span>Provides: </span>
                    <strong>{print(details.provides)}</strong>
                  </div>
                  <div className="tagColor">
                    <span>Meeting with: </span>
                    {details.meetingWith?.map((m) => <strong><Tag color="#242424">{print(m)}</Tag></strong>)}
                  </div>
                  {details?.categories?.length && (
                  <div className="tagColor">
                    <span>Category: </span>
                    {details.categories?.map((c) => (
                      <Link
                        href={{
                          pathname: '/search/category',
                          query: { id: c.slug }
                        }}
                        as={`/category/${c.slug}`}
                      >
                        <a>
                          {c.name}
                        </a>
                      </Link>
                    )).reduce((prev, curr) => [prev, '; ', curr])}
                  </div>
                  )}
                </div>
              </div>
              <div className="form-container form-button">
                <div>
                  <Row>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <Button
                        onClick={() => {
                          if (!loggedIn) {
                            message.info('Please login to chat with the model');
                            return;
                          }
                          Router.push({ pathname: '/messages', query: { toSource: 'performer', toId: details.userId } }, `/messages?toSource=performer&toId=${details.userId}`);
                        }}
                        disabled={currentUser?.roles.includes('performer')}
                      >
                        CHAT
                      </Button>
                    </Col>
                    <Col lg={12} md={12} sm={24} xs={24}>
                      <Button
                        className="btn-book"
                        onClick={() => {
                          if (!loggedIn) {
                            message.info('Please login to chat with the model');
                            return;
                          }
                          Router.push({ pathname: '/booking', query: { username: performer?.username } });
                        }}
                      >
                        BOOK
                      </Button>
                    </Col>
                  </Row>
                </div>

              </div>
            </Col>
          </Row>
          <ProfileContact performer={performer} scrollDownToReviewList={scrollDownToReviewList} />
          <div>
            <h3 className="card-title">RATES</h3>
            <ProfileRates
              attributes={attributes}
              rateSettings={rateSettings}
              currency={details.currency}
            />
          </div>
          <div>
            <h3 className="card-title">SERVICES</h3>
            <PerformeServicesList
              attributes={attributes}
              serviceSettings={serviceSettings}
              currency={details.currency}
            />
          </div>
          <div className="reviews mt-3">
            <Review sourceId={performer._id} source="performer" performer={performer} />
          </div>
        </Col>
        <Col lg={6} md={8} sm={24} xs={24} className="mb-5 mt-3">
          <RelatedProfiles performerId={performer?._id} />
        </Col>
      </Row>
    </Layout>
  );
}

const mapStates = (state: any) => ({
  ui: state.ui,
  attributes: state.settings.attributes
});

const ProfileConnectRedux = connect(mapStates)(PerformerProfile) as any;

ProfileConnectRedux.getInitialProps = async ({ ctx }) => {
  try {
    const { query } = ctx;
    const resp = await performerService.findOne(query.id);
    const { data: performer } = resp;

    if (!performer) {
      return redirect404(ctx);
    }

    return {
      performer
    };
  } catch (e) {
    return redirect404(ctx);
  }
};

export default ProfileConnectRedux;
