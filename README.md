# Unique Cell

A unique cell can be created on the Nervos CKB through [TypeID](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#type-id) which makes sure the unique cell cannot be updated or destroyed. 

The unique cell data can store any data, such as [XUDT](https://talk.nervos.org/t/rfc-extensible-udt/5337) token information and the contract will not check the content and format of the cell data.

## Unique Type Script

```yaml
unique type script:
  code_hash: 
    unique_type
  args:
    type_id[0..20]  // docs below describes how to generate this
```

### How to generate args
https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#type-id

> There are two ways to create a new cell with a specific type id.

> 1. Create a transaction which uses any out point as tx.inputs[0] and has a output cell whose type script is Type ID. The output cell's type script args is the hash of tx.inputs[0] and its output index. Because any out point can only be used once as an input, tx.inputs[0] and thus the new type id must be different in each creation transaction.
> 2. Destroy an old cell with a specific type id and create a new cell with the same type id in the same transaction.

Implemetation can be found in `generator-example/src/index.ts`
```ts
const generateUniqueTypeArgs = (firstInput: CKBComponents.CellInput, firstOutputIndex: number) => {
  const input = hexToBytes(serializeInput(firstInput));
  const s = blake2b(32, null, null, PERSONAL);
  s.update(input);
  s.update(hexToBytes(`0x${u64ToLe(BigInt(firstOutputIndex))}`));
  return `0x${s.digest("hex").slice(0, 40)}`;
};
```
`generator-example/src/lumos.ts`
```ts
function generateUniqueTypeArgs(input: Input, index: number) {
  const hasher = new utils.CKBHasher();
  hasher.update(blockchain.CellInput.pack(input));
  hasher.update(Uint64.pack(index));
  return hasher.digestHex().slice(0, 42);
}
```

## XUDT Information

The following is the info data format recommended by XUDT：

```yaml
# general

# The number of decimals the XUDT token uses - e.g. 8, means to divide the token amount by 100000000 to get its user representation. 
# 0xF0-0xFF reserved
decimal: uint8  

# The length of the name in bytes
len: uint8

# The name of the XUDT token - e.g. USDT, means to convert 'Tether USDT' to hex form '0x5465746865722055534454'
name: variable max 255

# The length of the symbol in bytes
len: uint8

# The symbol of the XUDT token - e.g. USDT, means to convert 'USDT' to hex form '0x55534454'
symbol: variable max 255

# optional
...

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
