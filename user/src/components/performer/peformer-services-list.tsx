import { formatNum } from '@lib/number';
import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import './profile-rates.less';

interface IProps {
  serviceSettings: Array<any>;
  // eslint-disable-next-line react/require-default-props
  attributes?: any;
  currency: string;
}

export function PerformeServicesList({
  serviceSettings,
  attributes = {} as any,
  currency
}: IProps) {
  const [dataSource, setDataSource] = useState([]);
  const getServiceDataSource = () => {
    const serviceDataSource = [];
    attributes.services.forEach((s) => {
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

  const printService = (text) => {
    switch (text) {
      case 'y':
      case 'Y':
        return 'Yes';
      case 'notComfortable':
        return 'Not Comfortable';
      default: return 'No';
    }
  };

  useEffect(() => {
    if (serviceSettings?.length && attributes?.services) {
      setDataSource(getServiceDataSource());
    }
  }, [serviceSettings, attributes]);

  const renderTable = () => (
    <div className="profile-rates">
      <table>
        <thead>
          <tr>
            <th>Service</th>
            <th>Included</th>
            <th>Extra</th>
          </tr>
        </thead>
        <tbody>
          {dataSource.map((data) => (
            <tr>
              <td>{data.text}</td>
              <td className="included-extra">
                {printService(data.include)}
              </td>
              <td className="included-extra">
                {data.price > 0 && data.include === 'n' ? `${currency}${formatNum(data.price)}` : null }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  if (!attributes?.services) return null;

  return <div className="form-container">{renderTable()}</div>;
}

const mapStates = (state: any) => ({
  attributes: state.settings.attributes
});

export default connect(mapStates)(PerformeServicesList);
