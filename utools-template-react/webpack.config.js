const path = require('path');
const HtmlWebpackPlugin = require('Html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

// Host
const isDev = process.env.NODE_ENV === 'development';
const host = process.env.HOST || '0.0.0.0';
const outputPath = path.join(__dirname, 'dist');

module.exports = (_, argv) => {
  console.log(_, argv);
  const mode = argv.mode;
  const isDev = mode === 'development';

  return {
    target: 'web',
    mode: 'development',
    devtool: !isDev ? 'hidden-source-map' : 'eval-cheap-source-map',
    entry: {
      index: './src/index.js'
    },
    output: {
      path: outputPath,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js'
    },
    devServer: {
      // Enable compression
      compress: true,
      host,
      port: 3000,
      devMiddleware: {
        publicPath: '/'
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      static: {
        publicPath: '/'
      }
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html'
      }),
      isDev
        ? () => {}
        : new CopyWebpackPlugin({
            patterns: [{ from: 'public', to: outputPath }]
          }),
      isDev && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    optimization: {
      runtimeChunk: 'single'
    },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: { chrome: 91 } }],
                '@babel/preset-react'
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { legacy: true }],
                '@babel/plugin-proposal-class-properties',
                [
                  'import',
                  {
                    libraryName: '@mui/material',
                    libraryDirectory: 'esm',
                    camel2DashComponentName: false
                  },
                  'material'
                ],
                [
                  'import',
                  {
                    libraryName: '@mui/icons-material',
                    libraryDirectory: 'esm',
                    camel2DashComponentName: false
                  },
                  'icons'
                ],
                // this code will evaluate to "false" when
                // "isDevelopment" is "false"
                // otherwise it will return the plugin
                isDev && require('react-refresh/babel')
                // this line removes falsy values from the array
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.(s[a|c]ss|css)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: { url: false }
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    }
  };
};
