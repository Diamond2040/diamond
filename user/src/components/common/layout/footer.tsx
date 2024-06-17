/* eslint-disable react/no-danger */
import { useEffect } from 'react';
import { Row, Col } from 'antd';
import {
  RightOutlined, TwitterOutlined, FacebookOutlined, YoutubeOutlined, GoogleOutlined
} from '@ant-design/icons';
import { connect } from 'react-redux';
import Link from 'next/link';

interface IProps {
  menus: any[];
  loggedIn: boolean;
  ui: any;
}

const Footer = ({ menus = [], loggedIn = false, ui = {} }: IProps) => {
  useEffect(() => {
    // checkAdult();
  }, []);

  const getMenus = (section) => menus
    .filter((m) => m.section === section)
    .filter((m) => !m.hideLoggedIn || (!loggedIn && m.hideLoggedIn));

  const renderIcon = (menu) => {
    switch (menu.icon) {
      case 'twitter':
        return <TwitterOutlined />;
      case 'facebook':
        return <FacebookOutlined />;
      case 'google':
        return <GoogleOutlined />;
      case 'youtube':
        return <YoutubeOutlined />;
      default:
        return <RightOutlined />;
    }
  };

  const renderSubMenus = (subMenus) => {
    if (!subMenus.length) return null;
    return (
      <ul>
        {subMenus.map((m) => {
          if (m.type === 'title') {
            return (
              <li key={m.title}>
                <h2 className="footer-heading">{m.title}</h2>
              </li>
            );
          }
          return (
            <li key={m.title}>
              {renderIcon(m)}
              {' '}
              <a
                rel="noreferrer"
                href={m.path}
                target={m.isNewTab ? '_blank' : ''}
              >
                {m.title}
              </a>
            </li>
          );
        })}
      </ul>
    );
  };

  const footerMenus = [
    getMenus('footer1'),
    getMenus('footer2'),
    getMenus('footer3')
  ].filter((m) => !!m.length);

  return (
    <div className="main-footer">
      <div className="main-container">
        <Row className="content">
          {footerMenus.map((subMenus) => (
            <Col lg={6} md={8} sm={12} xs={12} key={Math.random()}>
              {renderSubMenus(subMenus)}
            </Col>
          ))}
        </Row>
      </div>
      {ui.footerContent ? <div className="footer-content" dangerouslySetInnerHTML={{ __html: ui.footerContent }} />
        : (
          <div className="copyright-text">
            <span>
              <Link href="/home">
                <a>{ui?.siteName}</a>
              </Link>
              {' '}
              © Copyright
              {' '}
              {new Date().getFullYear()}
            </span>
          </div>
        )}
    </div>
  );
};

const mapState = (state: any) => ({
  menus: state.ui?.menus || [],
  loggedIn: state.auth.loggedIn,
  ui: state.ui
});
export default connect(mapState)(Footer) as any;
