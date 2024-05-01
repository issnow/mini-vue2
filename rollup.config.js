import typescript from '@rollup/plugin-typescript'
import pkg from './package.json'

let path = require('path')
export default {
  input: 'src/index.js',
  output: [
    //1.cjs -> commonjs
    //2.esm
    {
      format: 'cjs',
      file: path.resolve(pkg.main)
    },
    {
      format: 'es',
      file: path.resolve(pkg.mudule)
    },
  ],
  plugins: [
    typescript()
  ]
}