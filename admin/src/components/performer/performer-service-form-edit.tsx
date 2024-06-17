import { useState, useEffect } from 'react';
import { performerService } from '@services/performer.service';
import {
  Button, Divider, InputNumber, message, Select
} from 'antd';
import { flatten } from 'lodash';

import './rate-service-settings.less';

interface IProps {
  performerId: string;
  // eslint-disable-next-line react/require-default-props
  attributes?: any;
  currency: string;
}

interface RatesProps {
  performerId: string;
  rateSettings: Array<any>;
  attributes: any;
  currency: string;
}

export function PerformerRatesSetting({
  performerId,
  rateSettings = [],
  currency,
  attributes = {} as any
}: RatesProps) {
  const [loading, setLoading] = useState(false);
  const [rateDataSource, setRateDataSource] = useState([]);

  const getRateDataSource = () => {
    const rateDataSources = [];
    attributes?.time?.forEach((t) => {
      const provides = {};
      attributes?.provides?.forEach((p) => {
        const setting = rateSettings.find((s) => s.service === p.key && t.key === s.time);

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
      const settings = rateDataSource.map((source) => attributes?.provides?.map((p) => ({
        service: p.key,
        time: source.timeKey,
        price: source[p.key] || null
      })));
      await performerService.updateSettings(performerId, 'rates', flatten(settings));
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
    <table className="rate-table">
      <thead>
        <tr>
          <th>Time</th>
          {attributes?.provides?.map((p) => (
            <th key={p.key}>{p.value}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rateDataSource.map((data) => (
          <tr key={data.time}>
            <td>{data.time}</td>
            {attributes?.provides?.map((p) => (
              <td key={p.key}>
                {currency}
                {' '}
                <InputNumber
                  min="0"
                  value={data[p.key] || ''}
                  onChange={(e) => updateData(data, p.key, e)}
                  placeholder="Enter price or leave blank"
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={attributes?.provides?.length + 1}>
            <Button onClick={submit} disabled={loading} type="primary">
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
  performerId: string;
  serviceSettings: Array<any>;
  attributes: any;
  currency: string;
}

export function PerformerServiceSettings({
  performerId,
  attributes,
  serviceSettings,
  currency
}: ServicesProps) {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);

  const getServiceDataSource = () => {
    const serviceDataSource = [];
    attributes?.services?.forEach((s) => {
      // const provides = {};
      // attributes.provides.forEach((p) => {
      const setting = serviceSettings.find((ss) => ss.service === s.key);

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
      await performerService.updateSettings(performerId, 'services', flatten(settings));
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
    <table className="rate-table">
      <thead>
        <tr>
          <th>Service</th>
          <th>Included</th>
          <th>Extra</th>
        </tr>
      </thead>
      <tbody>
        {dataSource.map((data) => (
          <tr key={data.key}>
            <td>{data.text}</td>
            <td>
              <Select value={data.include} onChange={(val) => updateData('include', data.key, val)}>
                <Select.Option value="n">No</Select.Option>
                <Select.Option value="y">Yes</Select.Option>
                <Select.Option value="notComfortable">Not Comfortable</Select.Option>
              </Select>
            </td>
            <td>
              {currency}
              {' '}
              <InputNumber
                disabled={data.include !== 'n'}
                min="0"
                value={data.price}
                onChange={(val) => updateData('extra', data.key, val)}
                placeholder="Enter price or leave blank"
              />
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={attributes?.provides?.length + 1}>
            <Button onClick={submit} disabled={loading} type="primary">
              Save changes
            </Button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
  return <div className="form-container">{renderTable()}</div>;
}

export function PerformeServicesFormEdit({ performerId, attributes, currency }: IProps) {
  const [performerSettings, setPerformerSettings] = useState([]);
  const [serviceSettings, setServices] = useState([]);
  const [rateSettings, setRateSetting] = useState([]);

  const populateStateData = () => {
    setRateSetting(performerSettings.find((d) => d.group === 'rates')?.settings || []);
    setServices(performerSettings.find((d) => d.group === 'services')?.settings || []);
  };

  const getSettings = async () => {
    const resp = await performerService.loadSettings(performerId);
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
      <h3>Rates</h3>
      <PerformerRatesSetting
        performerId={performerId}
        attributes={attributes}
        rateSettings={rateSettings}
        currency={currency}
      />

      <Divider />

      <h3>Services</h3>
      <PerformerServiceSettings
        performerId={performerId}
        attributes={attributes}
        serviceSettings={serviceSettings}
        currency={currency}
      />
    </>
  );
}

export default PerformeServicesFormEdit;
