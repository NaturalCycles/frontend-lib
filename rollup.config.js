import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.ts',
  output: {
    name: 'jslib',
    dir: 'tmp/dist-umd',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    resolve(),
    typescript({
      tsconfig: false,
      target: 'es2015', // target browsers
      experimentalDecorators: true,
    }),
  ],
}
