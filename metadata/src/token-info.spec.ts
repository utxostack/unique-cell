import { describe, it, expect } from 'vitest';
import { encodeTokenInfo, decodeTokenInfo } from './token-info';
import { TokenInfo } from './types';

describe('encode and decode token info', () => {
  it('encodeTokenInfo', () => {
    const token: TokenInfo = {
      decimal: 8,
      name: 'Bitcoin',
      symbol: 'BTC',
      // 0x775f05a074000
      totalSupply: `0x${(BigInt(2100_0000) * BigInt(10 ** 8)).toString(16)}`,
    };
    const actual1 = encodeTokenInfo(token);
    expect(actual1).toBe('0x0807426974636f696e0342544301000000100000000040075af07507000000000000000000');

    const token2: TokenInfo = {
      decimal: 8,
      name: 'Bitcoin Fork',
      symbol: 'BTCF',
    };
    const actual2 = encodeTokenInfo(token2);
    expect(actual2).toBe('0x080c426974636f696e20466f726b0442544346');
  });

  it('decodeTokenInfo', () => {
    const actual1 = decodeTokenInfo('0x0807426974636f696e0342544301000000100000000040075af07507000000000000000000');
    expect(actual1.decimal).toBe(8);
    expect(actual1.name).toBe('Bitcoin');
    expect(actual1.symbol).toBe('BTC');
    // BigInt(2100_0000) * BigInt(10 ** 8)
    expect(actual1.totalSupply).toBe('0x775f05a074000');

    const actual2 = decodeTokenInfo('0x080c426974636f696e20466f726b0442544346');
    expect(actual2).toStrictEqual({
      decimal: 8,
      name: 'Bitcoin Fork',
      symbol: 'BTCF',
    });
  });
});
