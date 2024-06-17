import { PureComponent } from 'react';
import { Select, message } from 'antd';
import { categoryService } from '@services/index';

interface IProps {
  placeholder?: string;
  style?: Record<string, string>;
  onSelect: Function;
  defaultValue?: string |string[];
  disabled?: boolean;
  isMultiple?:boolean;
  group?: string;
  noEmtpy?: boolean;
}

export class SelectCategoryDropdown extends PureComponent<IProps> {
  state = {
    loading: false,
    data: [] as any
  };

  componentDidMount() {
    const { group = '' } = this.props;
    this.loadCategories(group);
  }

  loadCategories = async (group) => {
    try {
      await this.setState({ loading: true });
      const resp = await categoryService.search({
        group, limit: 500, status: 'active'
      });
      this.setState({
        data: resp.data.data,
        loading: false
      });
    } catch (e) {
      const err = await e;
      message.error(err?.message || 'Error on load categories');
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      style, onSelect, defaultValue, disabled, isMultiple, noEmtpy
    } = this.props;
    const { data, loading } = this.state;
    return (
      <Select
        mode={isMultiple ? 'multiple' : null}
        showSearch
        defaultValue={defaultValue}
        placeholder={`Select ${isMultiple ? 'categories' : 'category'} here`}
        style={style}
        onChange={(val) => onSelect(val)}
        loading={loading}
        optionFilterProp="children"
        disabled={disabled}
      >
        {!noEmtpy && (
        <Select.Option value="" key="all" style={{ textTransform: 'capitalize' }}>
          All categories
        </Select.Option>
        )}
        {data && data.length > 0 && data.map((u) => (
          <Select.Option value={u._id} key={u._id} style={{ textTransform: 'capitalize' }}>
            {`${u?.name || u?.slug || 'N/A'}`}
          </Select.Option>
        ))}
      </Select>
    );
  }
}
