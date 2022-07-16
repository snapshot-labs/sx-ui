import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import networks from '@snapshot-labs/snapshot.js/src/networks.json';
import { getUrl as snapshotGetUrl } from '@snapshot-labs/snapshot.js/src/utils';
import pkg from '@/../package.json';

const IPFS_GATEWAY: string =
  import.meta.env.VITE_IPFS_GATEWAY || 'https://cloudflare-ipfs.com';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: '%s ago',
    past: '%s left',
    s: 'now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1m',
    MM: '%dm',
    y: '1y',
    yy: '%dy'
  }
});

export function getUrl(str: string) {
  return snapshotGetUrl(str, IPFS_GATEWAY);
}

export function shortenAddress(str = '') {
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function shorten(str: string, key?: any): string {
  if (!str) return str;
  let limit;
  if (typeof key === 'number') limit = key;
  if (key === 'symbol') limit = 6;
  if (key === 'name') limit = 64;
  if (key === 'choice') limit = 12;
  if (limit)
    return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
  return shortenAddress(str);
}

export function explorerUrl(network, str: string, type = 'address'): string {
  if (network === 'starknet') type = 'contract';
  return `${networks[network].explorer}/${type}/${str}`;
}

export function _n(value) {
  const formatter = new Intl.NumberFormat('en', { notation: 'standard' });
  return formatter.format(value);
}

export function jsonParse(input, fallback?) {
  if (typeof input !== 'string') {
    return fallback || {};
  }
  try {
    return JSON.parse(input);
  } catch (err) {
    return fallback || {};
  }
}

export function lsSet(key: string, value: any) {
  return localStorage.setItem(`${pkg.name}.${key}`, JSON.stringify(value));
}

export function lsGet(key: string, fallback?: any) {
  const item = localStorage.getItem(`${pkg.name}.${key}`);
  return jsonParse(item, fallback);
}

export function lsRemove(key: string) {
  return localStorage.removeItem(`${pkg.name}.${key}`);
}

export function _t(number) {
  try {
    return dayjs(number * 1e3).format('MMM d, YYYY · h:mm A');
  } catch (e) {
    console.log(e);
    return '';
  }
}

export function _rt(number) {
  try {
    return dayjs(number * 1e3).toNow(false);
  } catch (e) {
    console.log(e);
    return '';
  }
}

export function abiToDefinition(abi) {
  const definition = {
    title: abi.name,
    type: 'object',
    properties: {},
    additionalProperties: false
  };
  abi.inputs.forEach(input => {
    definition.properties[input.name] = {};
    let type = 'string';
    if (input.type === 'bool') type = 'boolean';
    if (input.type === 'uint256') {
      definition.properties[input.name].format = 'uint256';
      definition.properties[input.name].examples = ['0'];
    }
    if (input.type === 'int256') {
      definition.properties[input.name].format = 'int256';
      definition.properties[input.name].examples = ['0'];
    }
    if (input.type === 'address') {
      definition.properties[input.name].format = 'address';
      definition.properties[input.name].examples = ['0x0000…'];
    }
    definition.properties[input.name].type = type;
    definition.properties[input.name].title = `${input.name} (${input.type})`;
  });
  return definition;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
