import { decodeMetadata, decodeTokenInfo, encodeMetadata, encodeTokenInfo, Metadata, TokenInfo } from "../src"

(() => {
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
})()