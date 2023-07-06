const path = require('path');
const CopyUmdToWeb = require('../plugins/copyUmdToWeb');

const outputConfig = {
  'cjs': {
    output: {
      filename: 'index.cjs.js',
      libraryTarget: 'commonjs2',
    },
    // externals: {
    //   react: {
    //     commonjs2: 'react',
    //   },
    //   antd: {
    //     commonjs2: 'antd',
    //   },
    // },
  },
  'umd': {
    output: {
      filename: 'index.umd.js',
      library: 'myLib',   //库的名字
      libraryTarget: 'umd',
    },

  },
};

const entryPath = {
  'cjs': './index-cjs.js',
  'umd': './index-umd.js',
};

module.exports = {
  entry: entryPath[process.env.BUILD_TYPE],
  mode: 'development',
  devtool: false,
  
  output: {
    path: path.resolve(__dirname, '../lib'),
    ...outputConfig[process.env.BUILD_TYPE].output,
  },
  externals: {
    ...outputConfig[process.env.BUILD_TYPE].externals,
  },
  plugins: [
    new CopyUmdToWeb(),
  ]
};