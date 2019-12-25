const PrerenderSPAPlugin = require('prerender-spa-plugin');
const path = require('path');
const ImageminPlugin = require('imagemin-webpack-plugin').default;
const imageminSvgo =  require('imagemin-svgo');

module.exports = (config, env) => {
  if (env === 'production') {
    config.plugins = config.plugins.concat([
      new PrerenderSPAPlugin({
        routes: ['/'],
        staticDir: path.join(__dirname, 'build'),
      }),
      new ImageminPlugin({
        plugins: [
          imageminSvgo({
            removeViewBox: false
          })
        ]
      }),
    ]);
  }

  return config;
};