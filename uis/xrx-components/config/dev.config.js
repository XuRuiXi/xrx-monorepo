const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: 'localhost',
    // port: 5200,
    compress: true, // 服务器压缩
    open: false, // 自动打开页面
    hot: true, // 热更新(默认开启)
    historyApiFallback: {
      index: '/index.html'
    },
    // contentBase: "./components",
    // watchContentBase: true,
    // before(app, server, compiler){
    //   console.log(app, server, compiler);
    //   console.log(1111);
    // }
  },
  plugins: [
    new ReactRefreshPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      publicPath: '/'
    }),
    // ignore表示不会被复制的目录
    new CopyWebpackPlugin({
      patterns: [
        {
          from: './public',
          to: './public',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ["**/favicon.ico"],
          },
        },
        {
          from: './public/favicon.ico',
          to: '.',
        }
      ]
    })
  ]
};