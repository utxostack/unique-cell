import { defineConfig } from 'tsup';

export default defineConfig({
  name: '@utxostack/metadata',
  dts: true,
  clean: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  entry: ['src/index.ts'],
});
