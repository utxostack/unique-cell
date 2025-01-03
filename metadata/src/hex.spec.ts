import { describe, it, expect } from 'vitest';
import { leToU128, u128ToLe, u32ToLe, utf8ToHex, bytesToHex, hexToUtf8 } from './hex';

describe('convertor', () => {
  it('u32toLe', () => {
    const expected = u32ToLe(21000000);
    expect('406f4001').toBe(expected);
  });

  it('u128ToLe', () => {
    const expected = u128ToLe(BigInt(2100_0000) * BigInt(10 ** 8));
    expect('0040075af07507000000000000000000').toBe(expected);
  });

  it('leToU128', () => {
    const expected = leToU128('0x00b864d9450000000000000000000000');
    expect(BigInt(3000_0000_0000)).toBe(expected);
  });

  it('bytesToHex', () => {
    const expected = bytesToHex(new Uint8Array([0x12, 0x34, 0x56]));
    expect('0x123456').toBe(expected);
  });

  it('utf8ToHex', () => {
    const actual = utf8ToHex('RGBPP Test Token');
    expect(actual).toBe('0x5247425050205465737420546f6b656e');
  });

  it('hexToUtf8', () => {
    const actual = hexToUtf8('0x5247425050205465737420546f6b656e');
    expect(actual).toBe('RGBPP Test Token');
  });
});
