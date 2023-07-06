const path = require('path');


module.exports = {
  entry: './src/index.js',
  performance: {
    "maxAssetSize": 5 * 1024 * 1024 // 打包的asset资源，超过5m会提示
  },
  // 自动补全省略的后缀
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@@': path.resolve(__dirname, '../'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/, // 不处理的文件夹
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/, // 不处理的文件夹
        use: ['babel-loader', 'ts-loader'],
      },
      {
        test: /\.css$/,
        // 使用多个loader的方式
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        // 使用多个loader的方式  
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]_[hash:5]'
              },
              importLoaders: 1,
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      },
      // webpack5开始，静态资源统一由asset模块处理
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        type: 'asset',
        generator: {
          filename: 'images/[name].[hash:10][ext]'
        },
        parser: {
          dataUrlCondition: {
            maxSize: 100 * 1024 // 80kb
          }
        }
      },
      {
        test: /\.ttf$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[hash:10][ext]'
        }
      },
      {
        test: /\.svg$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [

  ]
};