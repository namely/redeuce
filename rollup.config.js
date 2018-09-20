import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const name = 'redeuce';
const exclude = 'node_modules/**';
const config = {
  input: 'src/index.js',
  plugins: [resolve(), babel({ exclude }), uglify()],
  output: { name, format: 'umd' },
};
export default config;
