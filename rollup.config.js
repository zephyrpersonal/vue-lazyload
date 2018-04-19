const babel = require('rollup-plugin-babel')

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'bundle.js',
    format: 'cjs',
    name: 'TinyVueImgLazyload'
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}
