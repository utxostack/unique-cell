import { hd, utils, config, helpers, commons, RPC, Indexer, HashType, DepType, Input } from '@ckb-lumos/lumos';
import { bytes, blockchain, Uint8, Uint64 } from '@ckb-lumos/lumos/codec';

// For test only, you should NEVER expose your mnemonic or privateKey in production
export const tom = {
  mnemonic: "genuine off symbol purity wink talk flash dutch question ramp butter airport",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwattmke7r0z6uhcgcvqf432jf958akkyq7a959g",
  publicKey: "0x03eeacb8187df51214ee935e77fb9ba2ee0e58414602ff181b18bdcb22baf78a37",
  privateKey: "0xadd168134dded69fbd7f43b6fb059585734fed7192917f2ed84e487d39f53de6",
};

const UNIQUE_CELL = {
  TESTNET: {
    CELL_DEP: {
      outPoint: {
        txHash: "0xff91b063c78ed06f10a1ed436122bd7d671f9a72ef5f5fa28d05252c17cf4cef",
        index: "0x0",
      },
      depType: "code" as DepType,
    },
    TYPE_SCRIPT: {
      codeHash: "0x8e341bcfec6393dcd41e635733ff2dca00a6af546949f70c57a706c0f344df8b",
      hashType: "type" as HashType,
    },
  },
  MAINNET: {
    CELL_DEP: {
      outPoint: {
        txHash: "0x67524c01c0cb5492e499c7c7e406f2f9d823e162d6b0cf432eacde0c9808c2ad",
        index: "0x0",
      },
      depType: "code" as DepType,
    },
    TYPE_SCRIPT: {
      codeHash: "0x2c8c11c985da60b0a330c61a85507416d6382c130ba67f0c47ab071e00aec628",
      hashType: "data1" as HashType,
    },
  }
}

function generateUniqueTypeArgs(input: Input, index: number) {
  const hasher = new utils.CKBHasher();
  hasher.update(blockchain.CellInput.pack(input));
  hasher.update(Uint64.pack(index));
  return hasher.digestHex().slice(0, 42);
}

async function main() {
  config.initializeConfig(config.TESTNET);
  
  const rpc = new RPC("https://testnet.ckb.dev/rpc");
  const indexer = new Indexer("https://testnet.ckb.dev/indexer");

  const lock = helpers.parseAddress(tom.address);
  const type = {
    ...UNIQUE_CELL.TESTNET.TYPE_SCRIPT,
    args: bytes.hexify(new Uint8Array(20)),   // 20 bytes placeholder
  };

  const coin = {
    decimal: 6,
    name: "UNIQUE COIN",
    symbol: "UNC",
  };

  const data = bytes.hexify(bytes.concat(
    Uint8.pack(coin.decimal),
    Uint8.pack(coin.name.length),
    new TextEncoder().encode(coin.name),
    Uint8.pack(coin.symbol.length),
    new TextEncoder().encode(coin.symbol),
  ));

  const cell = helpers.cellHelper.create({ lock, type, data });

  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });
  txSkeleton = helpers.addCellDep(txSkeleton, UNIQUE_CELL.TESTNET.CELL_DEP);
  txSkeleton = await commons.common.injectCapacity(txSkeleton, [tom.address], cell.cellOutput.capacity);
  // set actual args
  cell.cellOutput.type!.args = generateUniqueTypeArgs({
    previousOutput: txSkeleton.get('inputs').get(0)!.outPoint!,
    since: txSkeleton.get('inputSinces').get(0, '0x0'),
  }, txSkeleton.get('inputs').size);

  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(cell));
  txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [tom.address], BigInt(1000));
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const signatures = txSkeleton
    .get('signingEntries')
    .map(({ message }) => hd.key.signRecoverable(message, tom.privateKey))
    .toArray();
  const tx = helpers.sealTransaction(txSkeleton, signatures);
  tx.hash = await rpc.sendTransaction(tx);
  console.log(`A unique cell has been created with tx hash ${tx.hash}`);
}

main();
