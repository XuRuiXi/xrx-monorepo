const path = require('path');
const CopyUmdToWeb = require('../plugins/copyUmdToWeb');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const packageName = require('../package.json').name;

const outputConfig = {
  'cjs': {
    output: {
      filename: 'index.cjs.js',
      libraryTarget: 'commonjs2',
    },
    // 过滤掉react和antd，这两个库不需要打包到组件库中
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
  'qiankun': {
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      globalObject: 'window',
    },
  },
};

const entryPath = {
  'cjs': './index-cjs.js',
  'umd': './index-umd.js',
  'qiankun': './src/index.js',
};

const plugins = [
  new CopyUmdToWeb(),
];

if (process.env.BUILD_TYPE === 'qiankun') {
  plugins.push(
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: './'
    })
  );
}

module.exports = {
  entry: entryPath[process.env.BUILD_TYPE], // 组件库打包
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
    ...plugins,
  ]
};