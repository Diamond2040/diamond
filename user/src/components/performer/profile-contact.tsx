/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  Row, Col, Button, message
} from 'antd';
import {
  PhoneOutlined, GlobalOutlined, HomeOutlined, MailOutlined, WhatsAppOutlined,
  WarningOutlined
} from '@ant-design/icons';
import './profile-contact.less';
import { IPerformer, IUser } from 'src/interfaces';
import { connect } from 'react-redux';
import Router from 'next/router';
import { AbuseReportContainer } from '@components/abuse-report';
import { favoriteService } from '@services/favorite-service';
import { useState } from 'react';

interface IProps {
  performer: IPerformer;
  scrollDownToReviewList: Function;
  currentUser: IUser;
  loggedIn: boolean;
}

function ProfileContact({
  performer, scrollDownToReviewList, currentUser, loggedIn
}: IProps) {
  const [changeText, setChangeText] = useState(false);
  if (!performer) {
    return null;
  }
  const addToFavorites = async () => {
    if (!loggedIn) {
      message.info('Please login');
      return;
    }
    const data = ({
      objectType: 'performer',
      objectId: performer?._id,
      action: 'favourite'
    });
    try {
      await favoriteService.create(data);
      message.success('Added to favorites');
      setChangeText(true);
    } catch (e) {
      message.error('Error an occurent, please try again later');
    }
  };

  const getPhone = (p) => {
    if (!p.phone) return '';
    if (!p.phoneCode) return p.phone;

    const codes = p.phoneCode.split('_');
    const code = codes.length === 2 ? codes[1] : codes[0];
    return `${code} ${p.phone}`;
  };

  const getPhoneCode = (p) => {
    if (!p.phoneCode) return '';
    const codes = p.phoneCode.split('_');
    return codes.length === 2 ? codes[1] : codes[0];
  };

  return (
    <div className="form-container">
      <h1 className="info-title">CONTACTs</h1>
      <Row>
        {performer.phone && (
          <Col lg={24} md={24} sm={24} xs={24}>
            <PhoneOutlined />
            {' '}
            Cell Phone:
            {' '}
            <a href={`https://wa.me/${getPhone(performer)}`}>
              (
              {getPhoneCode(performer)}
              )
              {' '}
              {performer.phone}
              {' '}
              <WhatsAppOutlined />
            </a>
          </Col>
        )}
        <Col lg={24} md={24} sm={24} xs={24}>
          <GlobalOutlined />
          {' '}
          Country:
          {' '}
          {performer.country}
        </Col>
        <Col lg={24} md={24} sm={24} xs={24}>
          <HomeOutlined />
          {' '}
          City:
          {' '}
          {performer.city}
        </Col>
        <Col lg={24} md={24} sm={24} xs={24}>
          <Button
            type="primary"
            onClick={() => Router.push(`/model/contact?to=${performer.username}`)}
          >
            <MailOutlined />
            Contact the Escort
          </Button>
        </Col>
        {/* Validate add favorite */}
        {!performer?.favourited && !changeText ? (
          <Col lg={8} md={8} sm={24} xs={24}>
            <Button type="primary" onClick={() => addToFavorites()}>
              Add to Favorites
            </Button>
          </Col>
        ) : (
          <Col lg={8} md={8} sm={24} xs={24}>
            <Button
              type="primary"
              onClick={() => Router.push('/user/my-favorite')}
            >
              Go to Favorites
            </Button>
          </Col>
        )}
        <Col lg={8} md={8} sm={24} xs={24}>
          <Button type="primary" onClick={() => scrollDownToReviewList()}>
            Add Review
          </Button>
        </Col>
        <Col lg={8} md={8} sm={24} xs={24}>
          <AbuseReportContainer
            user={currentUser}
            loggedIn={loggedIn}
            targetId={performer?.userId}
            targetUsername={performer?.username}
            btnProps={{
              type: 'default',
              icon: <WarningOutlined />,
              children: 'Report Fake'
            }}
          />
        </Col>
      </Row>
    </div>
  );
}

const mapStates = (state) => ({
  ui: state.ui,
  loggedIn: state.auth.loggedIn,
  currentUser: state.user.current,
  currentPerformer: state.performer.current
});

export default connect(mapStates)(ProfileContact);
