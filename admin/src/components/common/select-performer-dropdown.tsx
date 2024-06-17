import { PureComponent } from 'react';
import {
  Select, message, Row, Col
} from 'antd';
import { debounce } from 'lodash';
import { performerService } from '@services/performer.service';
import './select-performer-dropdown.less';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string |string[];
  disabled?: boolean;
  isMultiple?: boolean;
  noEmtpy?: boolean;
}

export class SelectPerformerDropdown extends PureComponent<IProps> {
  state = {
    loading: false,
    data: [] as any
  };

  loadPerformers = debounce(async (q) => {
    try {
      await this.setState({ loading: true });
      const resp = await (await performerService.search({ q, limit: 500 })).data;
      this.setState({
        data: resp.data,
        loading: false
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
      this.setState({ loading: false });
    }
  }, 500);

  async componentDidMount() {
    try {
      await this.setState({ loading: true });
      const resp = await (await performerService.search({ q: '', limit: 500 })).data;
      this.setState({
        data: resp.data,
        loading: false
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error occured');
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      style, onSelect, defaultValue, disabled = false, isMultiple, noEmtpy
    } = this.props;
    const { data, loading } = this.state;
    return (
      <Row gutter={24}>
        <Col lg={6} md={8} xs={12}>
          <Select
            className="search-performer"
            mode={isMultiple ? 'multiple' : null}
            showSearch
            defaultValue={defaultValue}
            placeholder="Type to search model here"
            style={style}
            onSearch={this.loadPerformers.bind(this)}
            onChange={(val) => onSelect(val)}
            loading={loading}
            optionFilterProp="children"
            disabled={disabled}
          >
            {!noEmtpy && (
              <Select.Option value="" key="all" style={{ textTransform: 'capitalize' }}>
                All model
              </Select.Option>
            )}
            {data && data.length > 0 && data.map((u) => (
              <Select.Option value={u.userId} key={u.userId} style={{ textTransform: 'capitalize' }}>
                {`${u?.name || u?.username || `${u?.firstName || ''} ${u?.lastNamme || ''}` || 'N/A'}`}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    );
  }
}
