import { useState } from 'react';
import {
  Input, Row, Col, Select, Button
} from 'antd';
import { connect } from 'react-redux';
import Router from 'next/router';
import './search-filter.less';

interface IProps {
  attributes: any;
  countries: Array<any>;
  languages: Array<any>;
}

function SearchFilter({
  attributes = {},
  countries = [],
  languages = []
}: IProps) {
  const [searchVal, setSearchVal] = useState(process.browser ? Router.query : {} as any);

  const ages = [
    {
      key: '18_20',
      value: '18 - 20'
    },
    {
      key: '21_25',
      value: '21 - 25'
    },
    {
      key: '26_29',
      value: '26 - 29'
    },
    {
      key: '30_39',
      value: '30 - 39'
    },
    {
      key: '40 - 90',
      value: '40 - ...'
    }
  ];

  const onChange = (field, val) => {
    setSearchVal({
      ...searchVal,
      [field]: val
    });
  };

  const onSearch = () => Router.push({
    pathname: '/search',
    query: {
      ...searchVal
    }
  });

  return (
    <div className="filter-main">
      <Row gutter={24}>
        <Col lg={6} xs={12}>
          <strong>Age</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('age', val)}
            value={searchVal.age || ''}
          >
            <Select value="">All</Select>
            {ages?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Country</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('country', val)}
            value={searchVal.country || ''}
          >
            <Select value="">All</Select>
            {countries?.map((o) => (
              <Select.Option value={o.code} key={o.code}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col span={6}>
          <strong>City</strong>
          <Input
            name="city"
            className="border-radius-0"
            placeholder="Enter state/city to search"
            onChange={(e) => onChange('city', e.target.value)}
            onPressEnter={() => onSearch()}
            value={searchVal.city || ''}
          />
        </Col>
        {/* <Col lg={6} xs={12}>
          <strong>Sexual Orientation</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('orientation', val)}
            value={searchVal.orientation || ''}
          >
            <Select value="">All</Select>
            {attributes?.orientations?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col> */}
        <Col lg={6} xs={12}>
          <strong>Meeting with</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('meetingWith', val)}
            value={searchVal.meetingWith || ''}
          >
            <Select value="">All</Select>
            {attributes?.meetingWith?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Tattoo</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('tattoo', val)}
            value={searchVal.tattoo || ''}
          >
            <Select value="">All</Select>
            {attributes?.tattoos?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col lg={6} xs={12}>
          <strong>Height</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('height', val)}
            value={searchVal.height || ''}
          >
            <Select value="">All</Select>
            {attributes?.heights?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Weight</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('weight', val)}
            value={searchVal.weight || ''}
          >
            <Select.Option value="" key="all">
              All
            </Select.Option>
            {attributes?.weights?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Language</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('languages', val)}
            value={searchVal.languages || ''}
          >
            <Select.Option value="" key="all">
              All
            </Select.Option>
            {languages?.map((o) => (
              <Select.Option value={o.name} key={o.code}>
                {o.name}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Ethnicity</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('ethnicity', val)}
            value={searchVal.ethnicity || ''}
          >
            <Select value="">All</Select>
            {attributes?.ethnicities?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Hair color</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('hairColor', val)}
            value={searchVal.hairColor || ''}
          >
            <Select value="">All</Select>
            {attributes?.hairColors?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col lg={6} xs={12}>
          <strong>Services offered</strong>
          <Select
            style={{ width: '100%' }}
            onChange={(val) => onChange('service', val)}
            value={searchVal.service || ''}
          >
            <Select value="">All</Select>
            {attributes?.services?.map((o) => (
              <Select.Option value={o.key} key={o.key}>
                {o.value}
              </Select.Option>
            ))}
          </Select>
        </Col>

        <Col span={6}>
          <strong>Model name</strong>
          <Input.Search
            name="q"
            allowClear
            enterButton
            placeholder="Enter model name"
            onPressEnter={() => onSearch()}
            onSearch={() => onSearch()}
            onChange={(e) => onChange('q', e.target.value)}
            value={searchVal.q || ''}
          />
        </Col>
        <Col span={6}>
          <div />
        </Col>
        <Col span={6} className="custom-col">
          <Button onClick={() => onSearch()} className="custom-btn">
            Search
          </Button>
        </Col>
      </Row>
    </div>
  );
}

const mapStates = (state: any) => ({
  attributes: state.settings.attributes,
  countries: state.settings.countries,
  languages: state.settings.languages
});

export default connect(mapStates)(SearchFilter);
