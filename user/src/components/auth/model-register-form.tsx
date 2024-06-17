import moment from 'moment';
import Link from 'next/link';
import {
  Form,
  Input,
  Row,
  Col,
  Button,
  Checkbox,
  Select,
  DatePicker,
  message,
  Upload
} from 'antd';
import { connect } from 'react-redux';
import React, { useRef, useState } from 'react';
import { ICountry, IPhoneCodes } from '../../interfaces/utils';

interface IProps {
  phoneCodes: IPhoneCodes[];
  countries: ICountry[];
  languages: any[];
  attributes: any;
  onSubmit: Function;
}

const ModelRegisterForm = ({
  onSubmit,
  phoneCodes = [],
  countries = [],
  languages = [],
  attributes = {} as any
}: IProps) => {
  const [phoneCode, setPhoneCode] = useState('US_+1');
  const [dob, setDOB] = useState(moment().subtract(18, 'year').endOf('day'));
  const dobRef = useRef(null);
  const [fileUpload, setFileUpload] = useState({
    documentVerification: null,
    idVerification: null
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  return (
    <Form
      name="member_register"
      initialValues={{
        remember: true,
        gender: 'female',
        country: 'United States of America'
      }}
      onFinish={(payload) => {
        if (!agreeTerms) return message.error('Please agree our Terms');

        const values = { ...payload };
        values.phoneCode = phoneCode;
        values.dateOfBirth = dob;
        return onSubmit(values, [
          {
            file: fileUpload.documentVerification,
            fieldname: 'documentVerification'
          },
          {
            file: fileUpload.idVerification,
            fieldname: 'idVerification'
          }
        ]);
      }}
      layout="vertical"
    >
      <Row>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="name"
            label="Display name"
            rules={[{ required: true, message: 'Please enter a display name' }]}
          >
            <Input placeholder="Display name" />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="username"
            label="Username"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              { required: true, message: 'Please input your username!' },
              {
                pattern: new RegExp(/^[a-z0-9]+$/g),
                message: 'Username must contain lowercase alphanumerics only'
              },
              {
                min: 3,
                message: 'Username must containt at least 3 characters'
              }
            ]}
            hasFeedback
          >
            <Input placeholder="Username" />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="email"
            label="Email"
            validateTrigger={['onChange', 'onBlur']}
            hasFeedback
            rules={[
              {
                type: 'email',
                message: 'Invalid email address!'
              },
              {
                required: true,
                message: 'Please input your email address!'
              }
            ]}
          >
            <Input placeholder="Email address" />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                pattern: new RegExp(/^[0-9]{9,12}$/),
                message: 'Enter 9-12 digits phone number'
              }
            ]}
          >
            <Input
              placeholder="9-12 digits phone number"
              addonBefore={(
                <Select
                  style={{ width: 120 }}
                  defaultValue="US_+1"
                  optionFilterProp="label"
                  showSearch
                  onChange={(val) => setPhoneCode(val)}
                >
                  {phoneCodes?.map((p) => (
                    <Select.Option
                      key={`${p.countryCode}_${p.code}`}
                      value={`${p.countryCode}_${p.code}`}
                      label={`${p.code} ${p.name}`}
                    >
                      {`${p.code} ${p.name}`}
                    </Select.Option>
                  ))}
                </Select>
              )}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="password"
            validateTrigger={['onChange', 'onBlur']}
            hasFeedback
            label="Password"
            rules={[
              {
                pattern: new RegExp(
                  /^(?=.{8,})(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z])(?=.*[^\w\d]).*$/g
                ),
                message:
                  'Password must have minimum 8 characters, at least 1 number, 1 uppercase letter, 1 lowercase letter & 1 special character'
              },
              { required: true, message: 'Please input your password!' }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="confirm"
            label="Confirm Password"
            validateTrigger={['onChange', 'onBlur']}
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Passwords do not match together!');
                }
              })
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="birthdate"
            label="Birthdate"
            rules={[
              {
                required: true
              }
            ]}
          >
            <DatePicker
              ref={dobRef}
              placeholder="YYYY-MM-DD"
              value={dob as any}
              onChange={(date) => setDOB(date as any)}
              disabledDate={(currentDate) => currentDate
                && currentDate > moment().subtract(18, 'year').endOf('day')}
              defaultPickerValue={
                moment().subtract(18, 'year').endOf('day') as any
              }
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item name="city" label="City">
            <Input placeholder="Your city" />
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item name="gender" label="Gender">
            <Select showSearch size="large">
              {attributes?.genders?.map((gender) => (
                <Select.Option key={gender.key} value={gender.key}>
                  {gender.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item
            name="country"
            label="Country"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Select showSearch optionFilterProp="label" size="large">
              {countries.map((country) => (
                <Select.Option
                  key={country.code}
                  label={country.name}
                  value={country.name}
                >
                  <img src={country.flag} width="25px" alt="flag" />
                  {' '}
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item name="languages" label="Languages">
            <Select showSearch size="large" mode="multiple">
              {languages.map((o) => (
                <Select.Option key={o.code} value={o.name}>
                  {o.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item name="height" label="Height">
            <Select showSearch size="large">
              {attributes?.heights?.map((o) => (
                <Select.Option key={o.key} value={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item name="weight" label="Weight">
            <Select showSearch size="large">
              {attributes?.weights?.map((o) => (
                <Select.Option key={o.key} value={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col lg={12} md={12} sm={24} xs={24}>
          <Form.Item name="orientation" label="Sexual Orientation">
            <Select showSearch size="large">
              {attributes.orientations?.map((o) => (
                <Select.Option key={o.key} value={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="meetingWith" label="Meeting with">
            <Select showSearch size="large" mode="multiple">
              {attributes.meetingWith?.map((o) => (
                <Select.Option key={o.key} value={o.key}>
                  {o.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name="aboutMe" label="About">
            <Input.TextArea rows={3} placeholder="Tell about yourself" />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="idVerification"
            label="ID verification"
            rules={[
              {
                required: true,
                message: 'ID verification document is required!'
              }
            ]}
            hasFeedback
          >
            <Upload
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: false
              }}
              fileList={
                fileUpload.idVerification ? [fileUpload.idVerification] : []
              }
              beforeUpload={(file) => {
                setFileUpload({ ...fileUpload, idVerification: file });
                return false;
              }}
            >
              <Button className="choose-file">Choose File</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item
            name="documentVerification"
            label="Upload documentation"
            rules={[
              {
                required: true,
                message: 'Document is required!'
              }
            ]}
            hasFeedback
          >
            <Upload
              showUploadList={{
                showPreviewIcon: false,
                showRemoveIcon: false
              }}
              fileList={
                fileUpload.documentVerification
                  ? [fileUpload.documentVerification]
                  : []
              }
              beforeUpload={(file) => {
                setFileUpload({ ...fileUpload, documentVerification: file });
                return false;
              }}
            >
              <Button className="choose-file">Choose File</Button>
            </Upload>
          </Form.Item>
        </Col>
        <Col xs={24}>
          <div className="agree-term">
            <p>
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              >
                I agree to the terms
              </Checkbox>
            </p>
            <br />
            <p>
              Already have an account?
              {' '}
              <Link href="/auth/login">
                <a>Click here to Login</a>
              </Link>
            </p>
          </div>
        </Col>
      </Row>
      <Form.Item>
        <Button type="primary" htmlType="submit" className="auth-btn">
          Next
        </Button>
      </Form.Item>
    </Form>
  );
};

const mapStatesToProps = (state: any) => ({
  ui: { ...state.ui },
  phoneCodes: state.settings.phoneCodes,
  countries: state.settings.countries,
  languages: state.settings.languages,
  attributes: state.settings.attributes
});

export default connect(mapStatesToProps)(ModelRegisterForm);
