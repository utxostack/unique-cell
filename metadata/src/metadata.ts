import { leToU128, leToU32, remove0x, u128ToLe, u32ToLe } from './hex';
import { Metadata } from './types';

const TAG_CALCULATING_SUPPLY = 2;
const TAG_ISSUER = 3;
const TAG_TOKEN_INFO_CELL_TYPE_HASH = 4;

/**
 * Encode metadata to hex string
 */
export const encodeMetadata = (metadata: Metadata): string => {
  const { issuer, circulatingSupply, tokenInfoCellTypeHash } = metadata;
  // issuer lock hash with 32 bytes
  const tagIssuer = `${u32ToLe(TAG_ISSUER)}${u32ToLe(32)}${remove0x(issuer)}`;
  // circulating supply with u128
  const tagCirculatingSupply = `${u32ToLe(TAG_CALCULATING_SUPPLY)}${u32ToLe(16)}${remove0x(u128ToLe(BigInt(circulatingSupply)))}`;
  // the type hash(32bytes) of the token info cell
  const tagTokenInfoCellTypeHash = `${u32ToLe(TAG_TOKEN_INFO_CELL_TYPE_HASH)}${u32ToLe(32)}${remove0x(tokenInfoCellTypeHash)}`;
  return `0x${tagTokenInfoCellTypeHash}${tagIssuer}${tagCirculatingSupply}`;
};

/**
 * Decode metadata from hex string
 */
export const decodeMetadata = (hex: string): Metadata => {
  const metadata: Metadata = {
    issuer: '',
    circulatingSupply: '0x0',
    tokenInfoCellTypeHash: '',
  };
  const raw = remove0x(hex);
  let index = 0;
  while (index < raw.length) {
    const tag = leToU32(raw.substring(index, index + 8));
    index += 8;
    // the hex length of the value
    const len = leToU32(raw.substring(index, index + 8)) * 2;
    index += 8;
    const value = raw.substring(index, index + len);
    index += len;
    switch (tag) {
      case TAG_ISSUER:
        metadata.issuer = `0x${value}`;
        break;
      case TAG_CALCULATING_SUPPLY:
        metadata.circulatingSupply = `0x${leToU128(`0x${value}`).toString(16)}`;
        break;
      case TAG_TOKEN_INFO_CELL_TYPE_HASH:
        metadata.tokenInfoCellTypeHash = `0x${value}`;
        break;
      default:
        break;
    }
  }
  return metadata;
};
