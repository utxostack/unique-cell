import { describe, it, expect } from 'vitest';
import { decodeMetadata, encodeMetadata } from './metadata';
import { Metadata } from './types';

describe('encode and decode metadata', () => {
  it('encodeMetadata', () => {
    const metadata: Metadata = {
      issuer: '0xa8efe3e8d534fbad88251c1f82cf2428f87637a27cfbf28b6365e9b74d895d18',
      circulatingSupply: BigInt(1600_0000) * BigInt(10 ** 8),
      tokenInfoCellTypeHash: '0x0f251aec82b7d329bfe94ac8456fd96c463248aec5551b18fd215ca5dcb94be7',
    };
    const actual = encodeMetadata(metadata);
    expect(actual).toBe(
      '0x04000000200000000f251aec82b7d329bfe94ac8456fd96c463248aec5551b18fd215ca5dcb94be70300000020000000a8efe3e8d534fbad88251c1f82cf2428f87637a27cfbf28b6365e9b74d895d1802000000100000000000a40731af05000000000000000000',
    );
  });

  it('decodeMetadata', () => {
    const actual = decodeMetadata(
      '0x04000000200000000f251aec82b7d329bfe94ac8456fd96c463248aec5551b18fd215ca5dcb94be70300000020000000a8efe3e8d534fbad88251c1f82cf2428f87637a27cfbf28b6365e9b74d895d1802000000100000000000a40731af05000000000000000000',
    );
    const { issuer, circulatingSupply, tokenInfoCellTypeHash } = actual;
    expect(issuer).toBe('0xa8efe3e8d534fbad88251c1f82cf2428f87637a27cfbf28b6365e9b74d895d18');
    expect(circulatingSupply).toBe(BigInt(1600_0000) * BigInt(10 ** 8));
    expect(tokenInfoCellTypeHash).toBe('0x0f251aec82b7d329bfe94ac8456fd96c463248aec5551b18fd215ca5dcb94be7');
  });
});
