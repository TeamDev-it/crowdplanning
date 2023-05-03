const webpack = require('webpack');
const path = require('path');

console.log(__dirname);
console.log('ENV:' + process.env.NODE_ENV);
var isDevelopment = process.env.NODE_ENV == 'development';


var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: process.env.NODE_ENV,
      BASE_URL: process.env.BASE_URL
    }
  })
];

module.exports = {
  filenameHashing: false,
  productionSourceMap: true,
  outputDir: path.resolve(__dirname, isDevelopment ? '../../main/public/modules/crowdplanning' : 'dist'),
  publicPath: '/modules/crowdplanning/',
  configureWebpack: {
    devServer: {
      watchOptions: {
        ignored: [/node_modules/, /public\/libs/, /libs/]
      }
    },
    output: {
      hashFunction: "sha256",
      filename: '[name].js',
      chunkFilename: '[name].js',
      libraryTarget: 'umd'
    },
    plugins: plugins,
    externals: ['vue', 'vue-router']
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV == 'production') {
      config.module.rule('css').oneOf('vue').uses.delete('extract-css-loader');
      config.module.rule('less').oneOf('vue').uses.delete('extract-css-loader');
      config.module.rule('less').oneOf('normal').uses.delete('extract-css-loader');
      config.module.rule('css').oneOf('vue').use('style-loader').before('css-loader').loader('style-loader').end();
      config.module.rule('less').oneOf('vue').use('style-loader').before('css-loader').loader('style-loader').end();
      config.module.rule('less').oneOf('normal').use('style-loader').before('css-loader').loader('style-loader').end();
    }
  },
  devServer: { https: false },
  runtimeCompiler: true
};
