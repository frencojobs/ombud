import type {Options} from 'tsup'
export const tsup: Options = {
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  format: ['cjs', 'esm'],
  entryPoints: ['src/index.ts']
}
