const { defineConfig } = require('@vue/cli-service');
module.exports = defineConfig({
  transpileDependencies: ['quasar'],

  devServer: {
    port: 8081,
  },

  pluginOptions: {
    quasar: {
      importStrategy: 'kebab',
      rtlSupport: false,
    },
  },
});
