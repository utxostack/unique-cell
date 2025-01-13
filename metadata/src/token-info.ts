import { hexToUtf8, leToU128, leToU32, remove0x, u128ToLe, u32ToLe, u8ToHex, utf8ToHex } from './hex';
import { TokenInfo } from './types';

const TAG_TOTAL_SUPPLY = 1;

/**
 * Encode token info to hex string
 */
export const encodeTokenInfo = (tokenInfo: TokenInfo): string => {
  const { decimal, name, symbol, totalSupply } = tokenInfo;
  const nameHex = utf8ToHex(name);
  const nameLen = u8ToHex(nameHex.length / 2);
  const symbolHex = utf8ToHex(symbol);
  const symbolLen = u8ToHex(symbolHex.length / 2);
  // total supply with u128
  const tagTotalSupply = totalSupply ? `${u32ToLe(TAG_TOTAL_SUPPLY)}${u32ToLe(16)}${u128ToLe(totalSupply)}` : '';
  return `0x${u8ToHex(decimal)}${nameLen}${nameHex}${symbolLen}${symbolHex}${tagTotalSupply}`;
};

/**
 * Decode token info from hex string
 */
export const decodeTokenInfo = (hex: string): TokenInfo => {
  const tokenInfo: TokenInfo = {
    decimal: 0,
    name: '',
    symbol: '',
    totalSupply: undefined,
  };
  const raw = remove0x(hex);
  let index = 0;
  tokenInfo.decimal = parseInt(raw.slice(index, index + 2), 16);
  index += 2;
  const nameLen = parseInt(raw.slice(index, index + 2), 16);
  index += 2;
  tokenInfo.name = hexToUtf8(raw.slice(index, index + nameLen * 2));
  index += nameLen * 2;
  const symbolLen = parseInt(raw.slice(index, index + 2), 16);
  index += 2;
  tokenInfo.symbol = hexToUtf8(raw.slice(index, index + symbolLen * 2));
  index += symbolLen * 2;

  if (raw.substring(index).length === 0) {
    return tokenInfo;
  }
  const tag = leToU32(raw.substring(index, index + 8));
  if (tag === TAG_TOTAL_SUPPLY) {
    index += 8;
    const len = leToU32(raw.substring(index, index + 8)) * 2;
    index += 8;
    const totalSupply = `0x${raw.substring(index, index + len)}`;
    tokenInfo.totalSupply = leToU128(totalSupply);
  }
  return tokenInfo;
};
