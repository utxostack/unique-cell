type HexString = string;

export interface Metadata {
  // issuer lock hash with 32 bytes
  issuer: HexString;
  // circulating supply with u128
  circulatingSupply: bigint;
  // the type hash(32bytes) of the token info cell
  tokenInfoCellTypeHash: HexString;
}

export interface TokenInfo {
  decimal: number;
  name: string;
  symbol: string;
  totalSupply?: bigint;
}
