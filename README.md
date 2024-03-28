# Unique Cell

A unique cell can be created on the Nervos CKB through [TypeID](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0022-transaction-structure/0022-transaction-structure.md#type-id) which makes sure the unique cell cannot be updated or destroyed. 

The unique cell data can store any data, such as [XUDT](https://talk.nervos.org/t/rfc-extensible-udt/5337) token information and the contract will not check the content and format of the cell data.

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
