const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin');

// let isProduction = process.env.NODE_ENV === "production";

module.exports = {
  publicPath: './',
  productionSourceMap: false,
  chainWebpack: config => {
    config.plugin('copy').tap(args => {
      // 添加第二组
      args[0][1] = {
        from: path.join(__dirname, './src/static'),
        to: path.join(__dirname, './dist/[name].[ext]'),
        globOptions: {
          ignore: ['**/*.ts']
        }
      };
      return args;
    });
    config.module
      .rule('ts')
      .use('ts-loader')
      .tap(options => {
        options.getCustomTransformers = () => ({
          before: [
            tsImportPluginFactory({
              libraryName: 'vant',
              libraryDirectory: 'es'
              // specify less file path
              // style: name => `${name}/style/index`
            })
          ]
        });
        options.compilerOptions = {
          module: 'es2015'
        };
        return options;
      });
  }
};
