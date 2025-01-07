# Unique Cell

A unique cell can be created on the Nervos CKB through [TypeID](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#type-id) which makes sure the unique cell cannot be updated or destroyed. 

The unique cell data can store any format data, such as [Extensible UDT (xUDT)](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0052-extensible-udt/0052-extensible-udt.md) token information and the contract will not check the content and format of the cell data.

When minting xUDT assets, a unique cell can be created at the same time to store xUDT information, but for the same xUDT, **only the first unique cell** that appears will be accepted.

## Unique Type Script

```yaml
unique type script:
  code_hash: 
    unique_type
  args:
    type_id[0..20]
```

### How to generate unique type script args
https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#type-id

> There are two ways to create a new cell with a specific type id.

> 1. Create a transaction which uses any out point as tx.inputs[0] and has a output cell whose type script is Type ID. The output cell's type script args is the hash of tx.inputs[0] and its output index. Because any out point can only be used once as an input, tx.inputs[0] and thus the new type id must be different in each creation transaction.
> 2. Destroy an old cell with a specific type id and create a new cell with the same type id in the same transaction.

Implementation can be found in `generator-example/src/index.ts` and `generator-example/src/lumos.ts`

## xUDT Information

The following is the info data format recommended by xUDT：

```yaml
# general

# The number of decimals the XUDT token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation. 
# 0xF0-0xFF reserved
decimal: uint8  

# The length of the name in bytes
name_len: uint8

# The name of the XUDT token - e.g. USDT, means to convert 'Tether USDT' to hex form '0x5465746865722055534454'
name: variable max 255

# The length of the symbol in bytes
symbol_len: uint8

# The symbol of the XUDT token - e.g. USDT, means to convert 'USDT' to hex form '0x55534454'
symbol: variable max 255

# optional
# tag0 | data_len0 | data0 | tag1 | data_len1 | data1 | tag2 | data_len2 | data2
total_supply: tag(4bytes) | data_length(4bytes) | data
...

```
**Notice: The xUDT information format is NOT a key-value structure.**

You can find the code about how to construct the xUDT information data in `metadata/examples/index.ts`
```ts
import { TokenInfo, encodeTokenInfo, Metadata, encodeMetadata } from '@utxostack/metadata'
const token: TokenInfo = {
  decimal: 8,
  name: 'Bitcoin',
  symbol: 'BTC',
  totalSupply: BigInt(2100_0000) * BigInt(10 ** 8),
}
const data = encodeTokenInfo(token)

const metadata: Metadata = {
  issuer: '0xa8efe3e8d534fbad88251c1f82cf2428f87637a27cfbf28b6365e9b74d895d18',
  circulatingSupply: BigInt(1600_0000) * BigInt(10 ** 8),
  tokenInfoCellTypeHash: '0x0f251aec82b7d329bfe94ac8456fd96c463248aec5551b18fd215ca5dcb94be7',
};
const hexData = encodeMetadata(metadata)
```

## Development

Build contracts:

``` sh
make build
```

Run tests:

``` sh
make test
```
