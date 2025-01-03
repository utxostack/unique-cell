import { describe, it, expect } from 'vitest';
import { leToU128, u128ToLe, u32ToLe, utf8ToHex, bytesToHex, hexToUtf8, u8ToHex } from './hex';

describe('convertor', () => {
  it('u8ToHex', () => {
    const actual = u8ToHex(8);
    expect(actual).toBe('08');
  });

  it('u32toLe', () => {
    const actual = u32ToLe(21000000);
    expect(actual).toBe('406f4001');
  });

  it('u128ToLe', () => {
    const actual = u128ToLe(BigInt(2100_0000) * BigInt(10 ** 8));
    expect(actual).toBe('0040075af07507000000000000000000');
  });

  it('leToU128', () => {
    const actual = leToU128('0x00b864d9450000000000000000000000');
    expect(actual).toBe(BigInt(3000_0000_0000));
  });

  it('bytesToHex', () => {
    const actual = bytesToHex(new Uint8Array([0x12, 0x34, 0x56]));
    expect(actual).toBe('123456');
  });

  it('utf8ToHex', () => {
    const actual = utf8ToHex('RGBPP Test Token');
    expect(actual).toBe('5247425050205465737420546f6b656e');
  });

  it('hexToUtf8', () => {
    const actual = hexToUtf8('0x5247425050205465737420546f6b656e');
    expect(actual).toBe('RGBPP Test Token');
  });
});
