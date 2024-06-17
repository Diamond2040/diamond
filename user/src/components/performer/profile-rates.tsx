import { formatNum } from '@lib/number';
import { useEffect, useState } from 'react';
import './profile-rates.less';

interface IProps {
  attributes: any;
  rateSettings: any;
  currency: '';
}

export function ProfileRates({
  attributes,
  rateSettings,
  currency
}: IProps) {
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

  useEffect(() => {
    if (rateSettings?.length && attributes?.provides) {
      setRateDataSource(getRateDataSource());
    }
  }, [rateSettings, attributes]);

  const renderRates = () => (
    <div className="profile-rates">
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
                <td key={p.key} className="title-servies">
                  <span>
                    {data[p.key] > 0 ? `${currency}${formatNum(data[p.key])}` : ''}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!attributes.provides) return null;

  return <div className="form-container">{renderRates()}</div>;
}
