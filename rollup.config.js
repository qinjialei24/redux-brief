import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { defineConfig } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript';

export default defineConfig({
  input: './src/index.ts',
  external: ['react', 'react-dom'],
  plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    nodeResolve(),
    commonjs(),
  ],
  output: [
    {
      format: 'es',
      file: 'dist/redux-brief.esm.js',
    },
    {
      format: 'es',
      file: 'dist/redux-brief.esm.min.js',
      plugins: [terser()],
    },
  ],
});
