import moment from 'moment';
import { useRef, useState, useEffect } from 'react';
import {
  Form, Input, Button, Select, message, Row, Col, DatePicker, Switch
} from 'antd';
import {
  IPerformer, IPhoneCodes, ILangguges, ICountry, IAttribute
} from 'src/interfaces';
import { subscriptionService } from '@services/subscription.service';

const { Option } = Select;

const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 }
};

const validateMessages = {
  required: 'This field is required!',
  types: {
    email: 'Not a validate email!',
    number: 'Not a validate number!'
  },
  number: {
    // eslint-disable-next-line no-template-curly-in-string
    range: 'Must be between ${min} and ${max}'
  }
};

const { TextArea } = Input;

interface IProps {
  // eslint-disable-next-line react/require-default-props
  performer?: IPerformer;
  submitting: boolean;
  phoneCodes: IPhoneCodes[];
  countries: ICountry[];
  languages: ILangguges[];

  genders: any[];
  heights: any[];
  weights: any[];
  eyes: IAttribute[];
  hairColors: IAttribute[];
  hairLengths: IAttribute[];
  bustSizes: IAttribute[];
  bustTypes: IAttribute[];
  travels: IAttribute[];
  ethnicities: IAttribute[];
  orientations: IAttribute[];
  provides: IAttribute[];
  meetingWith: IAttribute[];
  services: IAttribute[];
  smokers: IAttribute[];
  tattoos: IAttribute[];
  currencies: IAttribute[];

  categories: any[];

  onFinish: Function;
}

export function AccountForm({
  submitting = false,
  performer = null,
  phoneCodes = [],
  countries = [],
  languages = [],
  genders = [],
  heights = [],
  weights = [],
  eyes = [],
  hairColors = [],
  hairLengths = [],
  bustSizes = [],
  bustTypes = [],
  travels = [],
  ethnicities = [],
  orientations = [],
  provides = [],
  meetingWith = [],
  services = [],
  smokers = [],
  tattoos = [],
  categories = [],
  currencies = [],
  onFinish
}: IProps) {
  const [dob, setDOB] = useState(moment().subtract(18, 'year').endOf('day'));
  const [phoneCode, setPhoneCode] = useState('US_+1');
  const [subscription, setSubscription] = useState(null);

  const formRef = useRef(null);
  const dobRef = useRef(null);

  const checkVip = async () => {
    if (performer?._id) {
      const resp = await subscriptionService.getPerformer(performer._id);
      setSubscription(resp.data);
    }
  };

  useEffect(() => {
    if (performer) {
      const data = { ...performer } as any;
      data.dateOfBirth = moment(performer.dateOfBirth);
      data.verified = performer.verified;
      if (performer.phoneCode) {
        setPhoneCode(performer.phoneCode);
      }
      formRef?.current.setFieldsValue(data);
      setDOB(moment(data.dateOfBirth));

      checkVip();
    }
  }, [performer]);

  return (
    <Form
      ref={formRef}
      {...layout}
      name="form-performer"
      onFinish={(payload) => {
        const values = { ...payload };
        values.phoneCode = phoneCode;
        values.dateOfBirth = dob;

        if ((values.password || values.confirmPassword) && values.password !== values.confirmPassword) {
          return message.error('Password and confirm password mismatch');
        }
        if (performer && values.username !== performer?.username) {
          return message.error('username cannot be changed.');
        }

        return onFinish(values);
      }}
      onFinishFailed={() => message.error('Please complete the required fields in tab general info')}
      validateMessages={validateMessages}
      initialValues={
        performer || {
          country: 'United States of America',
          status: 'active',
          gender: 'male',
          phoneCode: 'US_+1',
          languages: ['English'],
          smoker: 'No',
          categoryIds: [],
          vip: false,
          verified: false,
          verifiedEmail: false
        }
      }
    >
      <Row>
        <Col xs={12} md={12}>
          <Form.Item
            name="name"
            label="Display name"
            rules={[{ required: true, message: 'Please enter a display name' }]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item
            name="username"
            label="Username"
            rules={[
              { required: true, message: 'Please input username!' },
              {
                pattern: new RegExp(/^[a-zA-Z0-9]+$/g),
                message: 'User name must contain alphanumerics only'
              },
              { min: 3, message: 'User name must containt at least 3 characters' }
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="firstName" label="First name">
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="lastName" label="Last name">
            <Input />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            label="Password"
            name="password"
            validateTrigger={['onChange', 'onBlur']}
            hasFeedback
            rules={[
              {
                required: !performer,
                message: 'Please enter password'
              },
              {
                min: 6,
                message: 'Password must have minimum 6 characters'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            validateTrigger={['onChange', 'onBlur']}
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: !performer,
                message: 'Please confirm password'
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  // eslint-disable-next-line prefer-promise-reject-errors
                  return Promise.reject('Confirm password does not match!');
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true
              }
            ]}
          >
            <Select>
              {genders.map((e) => (
                <Option key={e.key} value={e.key}>
                  {e.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col md={12} xs={12}>
          <Form.Item
            // name="dateOfBirth"
            label="Date of Birth"
            validateTrigger={['onChange', 'onBlur']}
            rules={[
              {
                required: true
              }
            ]}
          >
            <DatePicker
              ref={dobRef}
              placeholder="YYYY-MM-DD"
              value={dob}
              onChange={(date) => setDOB(date as any)}
              disabledDate={(currentDate) => currentDate && currentDate > moment().subtract(18, 'year').endOf('day')}
              defaultPickerValue={moment().subtract(18, 'year').endOf('day')}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="email" label="Email address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="currency" label="Currency">
            <Select showSearch optionFilterProp="label" defaultValue="usd">
              {currencies.map((currency) => (
                <Select.Option key={currency.key} value={currency.value}>
                  {currency.key}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={16} md={16}>
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
                  value={phoneCode}
                  optionFilterProp="label"
                  showSearch
                  onChange={(val) => setPhoneCode(val)}
                >
                  {phoneCodes?.map((p) => (
                    <Option
                      key={`${p.countryCode}_${p.code}`}
                      value={`${p.countryCode}_${p.code}`}
                      label={`${p.code} ${p.name}`}
                    >
                      {`${p.code} ${p.name}`}
                    </Option>
                  ))}
                </Select>
              )}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
        <Col xs={8} md={8}>
          <Form.Item name="phonePrivacy" label="Edit">
            <Select defaultValue="public">
              <Option key="public" value="public">
                Public
              </Option>
              <Option key="private" value="private">
                Private
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} md={24}>
          <Form.Item name="aboutMe" label="About Me">
            <TextArea rows={3} minLength={1} maxLength={2000} placeholder="Maximum length is 2000 characters" />
          </Form.Item>
        </Col>
        <Col xs={12} md={8}>
          <Form.Item label="Subscribed?" help="ON implies escort has a subscription.">
            <Switch disabled checked={subscription?.status === 'active'} />
          </Form.Item>
          {subscription?.status === 'active' && (
            <p className="help">
              Expires at
              {' '}
              {moment(subscription.expiredAt).format('YYYY-MM-DD')}
            </p>
          )}
        </Col>
        <Col xs={12} md={8}>
          <Form.Item
            name="verified"
            label="Verified?"
            help="Turn ON to show a verified tag for the escort."
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={12} md={8}>
          <Form.Item
            name="verifiedEmail"
            label="Email Verified?"
            help="Turn ON to confirm if escort has verified their email."
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="services" label="Services">
            <Select showSearch mode="multiple">
              {services?.map((s) => (
                <Option key={s.key} value={s.key}>
                  {s.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item label="Categories" name="categoryIds">
            <Select mode="multiple" showSearch placeholder="Select categories" optionFilterProp="children">
              {categories.map((u) => (
                <Select.Option value={u._id} key={u._id} style={{ textTransform: 'capitalize' }}>
                  {`${u?.name || u?.slug || 'N/A'}`}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="eyes" label="Eye color">
            <Select showSearch>
              {eyes?.map((e) => (
                <Option key={e.key} value={e.key}>
                  {e.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="hairColor" label="Hair color">
            <Select showSearch>
              {hairColors.map((hc) => (
                <Option key={hc.key} value={hc.key}>
                  {hc.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="hairLength" label="Hair length">
            <Select showSearch>
              {hairLengths.map((hl) => (
                <Option key={hl.key} value={hl.key}>
                  {hl.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="bustSize" label="Bust size">
            <Select showSearch>
              {bustSizes.map((bs) => (
                <Option key={bs.key} value={bs.key}>
                  {bs.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="bustType" label="Bust type">
            <Select showSearch>
              {bustTypes?.map((bt) => (
                <Option key={bt.key} value={bt.key}>
                  {bt.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="travels" label="Travel">
            <Select showSearch mode="multiple">
              {travels.map((travel) => (
                <Option key={travel.key} value={travel.key}>
                  {travel.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="weight" label="Weight">
            <Select showSearch>
              {weights.map((w) => (
                <Option key={w.key} value={w.key}>
                  {w.value}
                </Option>
              ))}
              <Option key="" value="">
                Unknow
              </Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="height" label="Height">
            <Select showSearch>
              {heights.map((h) => (
                <Option key={h.key} value={h.key}>
                  {h.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="ethnicity" label="Ethnicity">
            <Select showSearch>
              {ethnicities.map((e) => (
                <Option key={e.key} value={e.key}>
                  {e.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="orientation" label="Orientation">
            <Select showSearch>
              {orientations.map((o) => (
                <Option key={o.key} value={o.key}>
                  {o.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="languages" label="Languages">
            <Select mode="multiple">
              {languages.map((l) => (
                <Select.Option key={l.code} value={l.name}>
                  {l.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="provides" label="Provides">
            <Select showSearch mode="multiple">
              {provides.map((p) => (
                <Option key={p.key} value={p.key}>
                  {p.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="meetingWith" label="Meeting with">
            <Select showSearch mode="multiple">
              {meetingWith.map((m) => (
                <Option key={m.key} value={m.key}>
                  {m.value}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="city" label="City">
            <Input placeholder="City" />
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="country" label="Country">
            <Select showSearch optionFilterProp="label">
              {countries.map((country) => (
                <Select.Option key={country.code} label={country.name} value={country.name}>
                  <img src={country.flag} width="25px" alt="flag" />
                  {' '}
                  {country.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="smoker" label="Smoker">
            <Select showSearch optionFilterProp="label">
              {smokers.map((smoker) => (
                <Select.Option key={smoker.key} value={smoker.key}>
                  {smoker.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={12}>
          <Form.Item name="tattoo" label="Tattoo">
            <Select showSearch optionFilterProp="label">
              {tattoos.map((tattoo) => (
                <Select.Option key={tattoo.key} value={tattoo.key}>
                  {tattoo.value}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={12} md={12}>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option key="active" value="active">
                Active
              </Select.Option>
              <Select.Option key="inactive" value="inactive">
                Inactive
              </Select.Option>
              <Select.Option key="waitingreview" value="waiting-for-review">
                Waiting for review
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 4 }}>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Submit
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
}
