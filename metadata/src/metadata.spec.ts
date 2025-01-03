import { describe, it, expect } from 'vitest';
import { decodeMetadata, encodeMetadata } from './metadata';
import { Metadata } from './types';

describe('encode and decode metadata', () => {
  it('encodeMetadata', () => {
    const metadata: Metadata = {
      issuer: `0x${'ff'.repeat(32)}`,
      circulatingSupply: BigInt(`0x${'ff'.repeat(16)}`),
      tokenInfoCellTypeHash: `0x${'ff'.repeat(32)}`,
    };
    const actual = encodeMetadata(metadata);
    expect(actual).toBe(
      '0x0400000020000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0300000020000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0200000010000000ffffffffffffffffffffffffffffffff',
    );
  });

  it('decodeMetadata', () => {
    const actual = decodeMetadata(
      '0x0400000020000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0300000020000000ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0200000010000000ffffffffffffffffffffffffffffffff',
    );
    const { issuer, circulatingSupply, tokenInfoCellTypeHash } = actual;
    expect(issuer).toBe('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
    expect(circulatingSupply).toBe(BigInt('0xffffffffffffffffffffffffffffffff'));
    expect(tokenInfoCellTypeHash).toBe('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
  });
});
