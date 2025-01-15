# Token Info and Metadata
[Unique cell data for xUDT information](https://github.com/utxostack/unique-cell?tab=readme-ov-file#xudt-information), referred to as Token Info, can encode the decimal, name, symbol, and other optional fields of fungible tokens into a hexadecimal format string. These fields are usually immutable. Any xUDT (or compatible-xUDT) asset that supports the unique cell information protocol will be decoded and displayed by CKB Explorer, JoyID Passkey wallet, and other CKB ecosystem projects.

In addition to supporting immutable Token Info data, Metadata is used to support mutable data. Similar to the optional fields in Token Info, both use a protocol similar to [BTC Lightning BOLT #11 Tags](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md#tagged-fields) to encode data.

## Tags and Fields for Pre-claim UTXO Airdrop Badge and UTXO

```TypeScript
const TAG_TOTAL_SUPPLY = 1;
export interface TokenInfo {
  // The number of decimals the xUDT (or compatible-xUDT) token uses
  decimal: number;
  // The name of the xUDT (or compatible-xUDT) token
  name: string;
  // The symbol of the xUDT (or compatible-xUDT) token
  symbol: string;
  // Optional field: tag (4 bytes) | data_length (4 bytes) | data
  totalSupply?: HexString;
}

const TAG_CALCULATING_SUPPLY = 2;
const TAG_ISSUER = 3;
const TAG_TOKEN_INFO_CELL_TYPE_HASH = 4;
// The fields follow the format: tag (4 bytes) | data_length (4 bytes) | data
export interface Metadata {
  // Issuer lock hash (32 bytes)
  issuer: HexString;
  // Circulating supply (u128)
  circulatingSupply: HexString;
  // Type hash (32 bytes) of the token info cell
  tokenInfoCellTypeHash: HexString;
}
```

## How to encode and decode Token Info and Metadata

The [`@utxostack/metadata`](https://www.npmjs.com/package/@utxostack/metadata) SDK provides methods to encode and decode Token Info and Metadata. Here is an example:

```TypeScript
import { decodeMetadata, decodeTokenInfo, encodeMetadata, encodeTokenInfo, Metadata, TokenInfo } from "@utxostack/metadata"

const token: TokenInfo = {
  decimal: 8,
  name: 'Bitcoin',
  symbol: 'BTC',
  totalSupply: `0x${(BigInt(2100_0000) * BigInt(10 ** 8)).toString(16)}`,
}
const data = encodeTokenInfo(token)
console.log('encoded token info:', data)

const decoded = decodeTokenInfo(data);
console.log('decoded token info:', decoded)

const metadata: Metadata = {
  issuer: '0xa8efe3e8d534fbad88251c1f82cf2428f87637a27cfbf28b6365e9b74d895d18',
  circulatingSupply: `0x${(BigInt(1600_0000) * BigInt(10 ** 8)).toString(16)}`,
  tokenInfoCellTypeHash: '0x0f251aec82b7d329bfe94ac8456fd96c463248aec5551b18fd215ca5dcb94be7',
};
const hexData = encodeMetadata(metadata)
console.log('encoded metadata:', hexData)

const decodedMetadata = decodeMetadata(hexData);
console.log('decoded metadata:', decodedMetadata)
```

## How to Add New Optional or Metadata Fields

The optional immutable fields of Token Info and mutable fields of Metadata all follow a protocol similar to [BTC Lightning BOLT #11 Tags](https://github.com/lightning/bolts/blob/master/11-payment-encoding.md#tagged-fields) to encode data. This allows anyone to add new fields to Token Info and Metadata.

If you want to submit new fields, please define the tags and field names. Any issues or pull requests are welcome.
