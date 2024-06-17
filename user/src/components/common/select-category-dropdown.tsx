import { PureComponent } from 'react';
import { Select, message } from 'antd';
import { debounce } from 'lodash';
import { categoriesService } from '@services/categories-sevice';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string;
  disabled?: boolean;
  group?: string;
}

export class SelectCategoryDropdown extends PureComponent<IProps> {
  state = {
    loading: false,
    data: [] as any
  };

  loadCategories = debounce(async (q) => {
    try {
      const { group = '' } = this.props;
      await this.setState({ loading: true });
      const resp = await (await categoriesService.userSearch({ q, limit: 500, group })).data;
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
      const { group = '' } = this.props;
      await this.setState({ loading: true });
      const resp = await (await categoriesService.userSearch({ q: '', limit: 500, group })).data;
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
      style, onSelect, defaultValue, disabled
    } = this.props;
    const { data, loading } = this.state;
    return (
      <Select
        showSearch
        defaultValue={defaultValue}
        placeholder="Type to search category here"
        style={style}
        onSearch={this.loadCategories.bind(this)}
        onChange={(val) => onSelect(val)}
        loading={loading}
        optionFilterProp="children"
        disabled={disabled}
      >
        <Select.Option value="" key="default">
          All categories
        </Select.Option>
        {data && data.length > 0 && data.map((u) => (
          <Select.Option value={u._id} key={u._id} style={{ textTransform: 'capitalize' }}>
            {`${u?.name || u?.slug}`}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
