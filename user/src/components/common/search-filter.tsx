import { PureComponent } from 'react';
import {
  Input, Select, DatePicker
} from 'antd';
import { SelectPerformerDropdown } from '@components/performer/common/select-performer-dropdown';
import { SelectCategoryDropdown } from './select-category-dropdown';

const { RangePicker } = DatePicker;
interface IProps {
  onSubmit?: Function;
  statuses?: {
    key: string;
    text?: string;
  }[];
  deliveryStatuses?: {
    key: string;
    text?: string;
  }[];
  type?: {
    key: string;
    text?: string;
  }[];
  searchWithPerformer?: boolean;
  searchWithCategories?: boolean;
  searchWithKeyword?: boolean;
  dateRange?: boolean;
  categoryGroup?: string;
}

export class SearchFilter extends PureComponent<IProps> {
  timeout: any;

  onSearchByKeyword = (q) => {
    const { onSubmit } = this.props;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.setState({ q }, () => onSubmit(this.state));
    }, 500);
  };

  render() {
    const {
      statuses = [],
      type = [],
      searchWithPerformer,
      searchWithCategories,
      searchWithKeyword,
      deliveryStatuses,
      dateRange,
      onSubmit,
      categoryGroup = ''
    } = this.props;
    return (
      <div className="filter-block">
        {searchWithKeyword && (
          <div className="filter-item custom">
            <Input
              style={{ width: '100%' }}
              placeholder="Enter keyword"
              onChange={(evt) => this.onSearchByKeyword(evt.target.value)}
              onPressEnter={() => onSubmit(this.state)}
            />
          </div>
        )}
        {dateRange && (
        <div className="filter-item custom">
          <RangePicker
            style={{ width: '100%' }}
            onChange={(dates: [any, any], dateStrings: [string, string]) => this.setState({
              fromDate: dateStrings[0],
              toDate: dateStrings[1]
            }, () => onSubmit(this.state))}
          />
        </div>
        )}
        {statuses && statuses.length > 0 && (
        <div className="filter-item">
          <Select
            onChange={(val) => this.setState({ status: val }, () => onSubmit(this.state))}
            style={{ width: '100%' }}
            placeholder="Select status"
            defaultValue=""
          >
            {statuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </div>
        )}
        {deliveryStatuses && deliveryStatuses.length > 0 && (
        <div className="filter-item">
          <Select
            onChange={(val) => this.setState({ deliveryStatuses: val }, () => onSubmit(this.state))}
            style={{ width: '100%' }}
            placeholder="Select delivery status"
            defaultValue=""
          >
            {deliveryStatuses.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </div>
        )}
        {type && type.length > 0 && (
        <div className="filter-item">
          <Select
            onChange={(val) => this.setState({ type: val }, () => onSubmit(this.state))}
            style={{ width: '100%' }}
            placeholder="Select type"
            defaultValue=""
          >
            {type.map((s) => (
              <Select.Option key={s.key} value={s.key}>
                {s.text || s.key}
              </Select.Option>
            ))}
          </Select>
        </div>
        )}
        {searchWithPerformer && (
        <div className="filter-item">
          <SelectPerformerDropdown
            placeholder="Search model here"
            style={{ width: '100%' }}
            onSelect={(val) => this.setState({ performerId: val || '' }, () => onSubmit(this.state))}
          />
        </div>
        )}

        {searchWithCategories && (
          <div className="filter-item">
            <SelectCategoryDropdown
              placeholder="Search category here"
              style={{ width: '100%' }}
              group={categoryGroup}
              onSelect={(val) => this.setState({ categoryId: val || '' }, () => onSubmit(this.state))}
            />
          </div>
        )}
      </div>
    );
  }
}
