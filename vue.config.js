const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  pwa: {
    name: 'Csavargó',
    themeColor: '#A45EE5',
    msTileColor: '#E59E0F',
    workboxPluginMode: 'GenerateSW',
    iconPaths: {
      faviconSVG: 'img/icons/favicon.svg',
      favicon32: 'img/icons/favicon32x32.png',
      favicon16: 'img/icons/favicon16x16.png',
      appleTouchIcon: 'img/icons/ios.png',
      maskIcon: 'img/icons/favicon.svg',
      msTileImage: 'img/icons/msTile.png',
    },
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/style/main.scss";`,
      },
    },
  },
  transpileDependencies: true,
});
