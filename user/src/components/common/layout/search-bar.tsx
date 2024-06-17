import { Input } from 'antd';
import Router from 'next/router';
import './search-bar.less';

const { Search } = Input;
interface IProps {
  // eslint-disable-next-line react/require-default-props
  onEnter?: Function;
}

export function SearchBar({
  onEnter
}: IProps) {
  const onSearch = (q) => {
    if (onEnter) onEnter(q);

    Router.push({ pathname: '/search', query: { q } });
  };

  return (
    <>
      <div className="search-bar">
        <Search
          placeholder="Type your search and press enter"
          allowClear
          enterButton
          onPressEnter={(e: any) => onSearch(e?.target?.value)}
          onSearch={onSearch}
        />
      </div>
      <div>
        <p>Search with names, age, country, hair color, body type, bust size, fetish, and more...</p>

      </div>
    </>
  );
}

export default SearchBar;
