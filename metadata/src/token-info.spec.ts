import { describe, it, expect } from 'vitest';
import { encodeTokenInfo, decodeTokenInfo } from './token-info';
import { TokenInfo } from './types';

describe('encode and decode token info', () => {
  it('encodeTokenInfo', () => {
    const token: TokenInfo = {
      decimal: 8,
      name: 'Bitcoin',
      symbol: 'BTC',
      totalSupply: BigInt(2100_0000) * BigInt(10 ** 8),
    };
    const actual = encodeTokenInfo(token);
    expect(actual).toBe('0x0807426974636f696e0342544301000000100000000040075af07507000000000000000000');

    const token2: TokenInfo = {
      decimal: 8,
      name: 'Bitcoin Fork',
      symbol: 'BTCF',
    };
    const actualData = encodeTokenInfo(token2);
    expect(actualData).toBe('0x080c426974636f696e20466f726b04425443460100000010000000');
  });

  it('decodeTokenInfo', () => {
    const actual = decodeTokenInfo('0x0807426974636f696e0342544301000000100000000040075af07507000000000000000000');
    const { decimal, name, symbol, totalSupply } = actual;
    expect(decimal).toBe(8);
    expect(name).toBe('Bitcoin');
    expect(symbol).toBe('BTC');
    expect(totalSupply).toBe(BigInt(2100_0000) * BigInt(10 ** 8));
  });
});
