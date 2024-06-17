import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { performerService } from '@services/performer.service';
import {
  Button, InputNumber, message, Select
} from 'antd';
import { flatten } from 'lodash';
import './performer-service-form-edit.less';

interface IProps {
  performerId: string;
  // eslint-disable-next-line react/require-default-props
  attributes?: any;
  currency: string;
}

interface RatesProps {
  rateSettings: Array<any>;
  attributes: any;
  currency: string;
}

export function PerformerRatesSetting({
  currency,
  rateSettings = [],
  attributes = {} as any
}: RatesProps) {
  const [loading, setLoading] = useState(false);
  const [rateDataSource, setRateDataSource] = useState([]);

  const getRateDataSource = () => {
    const rateDataSources = [];
    attributes.time.forEach((t) => {
      const provides = {};
      attributes.provides.forEach((p) => {
        const setting = rateSettings.find(
          (s) => s.service === p.key && t.key === s.time
        );

        provides[p.key] = setting ? setting.price : null;
      });

      rateDataSources.push({
        time: t.value,
        timeKey: t.key,
        ...provides
      });
    });
    return rateDataSources;
  };

  const updateData = (source, key, val) => {
    const item = rateDataSource.find((s) => s.timeKey === source.timeKey);
    item[key] = val;
    setRateDataSource([...rateDataSource]);
  };

  const submit = async () => {
    try {
      setLoading(true);
      const settings = rateDataSource.map((source) => attributes.provides.map((p) => ({
        service: p.key,
        time: source.timeKey,
        price: source[p.key] || null
      })));
      await performerService.updateSettings('rates', flatten(settings));
      message.success('Updated successfully');
    } catch (e) {
      message.error('Updated failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setRateDataSource(getRateDataSource());
  }, [rateSettings]);

  const renderRates = () => (
    <table>
      <thead>
        <tr>
          <th>Time</th>
          {attributes.provides.map((p) => (
            <th key={p.key}>{p.value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rateDataSource.map((data) => (
          <tr key={data.time}>
            <td>{data.time}</td>
            {attributes.provides.map((p) => (
              <td key={p.key}>
                {data[p.key] > 0 && currency}
                {' '}
                <InputNumber
                  min="0"
                  value={data[p.key] || ''}
                  onChange={(e) => updateData(data, p.key, e)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={attributes.provides.length + 1}>
            <Button onClick={submit} disabled={loading} className="btn-submit">
              Save changes
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
  return <div className="form-container">{renderRates()}</div>;
}

interface ServicesProps {
  serviceSettings: Array<any>;
  attributes: any;
  currency: string;
}

export function PerformerServiceSettings({ attributes, serviceSettings, currency }: ServicesProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const getServiceDataSource = () => {
    const serviceDataSource = [];
    attributes.services.forEach((s) => {
      // const provides = {};
      // attributes.provides.forEach((p) => {
      const setting = serviceSettings.find(
        (ss) => ss.service === s.key
      );

      serviceDataSource.push({
        key: s.key,
        text: s.value,
        include: setting?.include || 'n',
        price: setting?.price || null
      });
    });
    return serviceDataSource;
  };

  const updateData = (t, key, val) => {
    const item = dataSource.find((s) => s.key === key);
    if (t === 'extra') item.price = val;
    else if (t === 'include') item.include = val;
    setDataSource([...dataSource]);
  };

  const submit = async () => {
    try {
      setLoading(true);
      const settings = dataSource.map((source) => ({
        service: source.key,
        price: source.price,
        include: source.include
      }));
      await performerService.updateSettings('services', flatten(settings));
      message.success('Updated successfully');
    } catch (e) {
      message.error('Updated failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDataSource(getServiceDataSource());
  }, [serviceSettings]);

  const renderTable = () => (
    <table>
      <thead>
        <tr>
          <th>Service</th>
          <th>Included</th>
          {/* <th>{' '}</th> */}
          <th>Extra</th>
        </tr>
      </thead>
      <tbody>
        {dataSource.map((data) => (
          <tr>
            <td>{data.text}</td>
            <td>
              <Select value={data.include} onChange={(val) => updateData('include', data.key, val)}>
                <Select.Option value="n">No</Select.Option>
                <Select.Option value="y">Yes</Select.Option>
                <Select.Option value="notComfortable">Not comfortable</Select.Option>
              </Select>
            </td>
            <td>
              {data.price > 0 && currency}
              {' '}
              <InputNumber
                disabled={data.include !== 'n'}
                min={0}
                className="input-services"
                value={data.price}
                onChange={(val) => updateData('extra', data.key, val)}
              />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={attributes.provides.length + 1}>
            <Button onClick={submit} disabled={loading} className="btn-submit">
              Save changes
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
  return <div className="form-container">{renderTable()}</div>;
}

export function PerformeServicesFormEdit({
  performerId,
  currency,
  attributes = {} as any
}: IProps) {
  const [performerSettings, setPerformerSettings] = useState([]);
  const [serviceSettings, setServices] = useState([]);
  const [rateSettings, setRateSetting] = useState([]);

  const populateStateData = () => {
    setRateSetting(
      performerSettings.find((d) => d.group === 'rates')?.settings || []
    );
    setServices(
      performerSettings.find((d) => d.group === 'services')?.settings || []
    );
  };

  const getSettings = async () => {
    const resp = await performerService.mySettings();
    setPerformerSettings(resp.data);
  };

  useEffect(() => {
    if (performerId) getSettings();
  }, [performerId]);

  useEffect(() => {
    populateStateData();
  }, [attributes]);

  useEffect(() => {
    populateStateData();
  }, [performerSettings]);

  return (
    <>
      <PerformerRatesSetting
        attributes={attributes}
        rateSettings={rateSettings}
        currency={currency}
      />

      <PerformerServiceSettings
        attributes={attributes}
        serviceSettings={serviceSettings}
        currency={currency}
      />
    </>
  );
}

const mapStates = (state: any) => ({
  attributes: state.settings.attributes
});

export default connect(mapStates)(PerformeServicesFormEdit);
