import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

export default {
  input: './src/index.ts',
  external: ['react'],
  plugins: [
    // babel(),
    typescript({
      typescript: require('typescript'),
    }),
    // sourceMaps(),
    nodeResolve(),
    commonjs(),
    terser(),
  ],
  output: [
    {
      format: 'cjs',
      file: 'lib/bundle.cjs.js',
    },
    {
      format: 'es',
      file: 'lib/bundle.esm.js',
    },
  ],
};
