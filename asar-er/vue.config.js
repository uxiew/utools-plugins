const path = require('path');
const merge = require('webpack-merge');
// const tsImportPluginFactory = require('ts-import-plugin');
const { name } = require('./package.json');

// let isProduction = process.env.NODE_ENV === "production";

module.exports = {
  parallel: false,
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: (config) => {
    config.plugin('copy').tap((args) => {
      // 添加第二组
      args[0][1] = {
        from: path.join(__dirname, './src/utools-configs'),
        to: path.join(__dirname, './dist/[name].[ext]'),
        globOptions: {
          ignore: ['**/*.ts'],
        },
      };
      return args;
    });

    config.plugin('define').tap((args) => {
      args[0]['process.env']['APP_NAME'] = JSON.stringify(name);
      return args;
    });

    // config.module
    //   .rule('ts')
    //   .use('ts-loader')
    //   .tap((options) => {
    //     options = merge(options, {
    //       happyPackMode: true,
    //       transpileOnly: true,
    //       getCustomTransformers: () => ({
    //         before: [
    //           tsImportPluginFactory({
    //             libraryName: 'vant',
    //             libraryDirectory: 'es',
    //             style: true,
    //           }),
    //         ],
    //       }),
    //       compilerOptions: {
    //         module: 'es2015',
    //       },
    //     });
    //     return options;
    //   });
  },
};
