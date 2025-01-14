import { isNumber, toNumber } from 'lodash';

export function shortenLargeNumber(num) {
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1).replace(/\.0$/, '')}G`;
  }
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }
  return num;
}

export function formatNum(num) {
  const n = !isNumber(num) ? toNumber(num) : num;
  return n.toFixed(2);
}
