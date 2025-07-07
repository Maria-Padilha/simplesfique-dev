const { defineConfig } = require('@vue/cli-service')
const {VuetifyPlugin} = require("webpack-plugin-vuetify");
module.exports = defineConfig({
    configureWebpack: {
        plugins: [
            new VuetifyPlugin(),
        ],
    },
  transpileDependencies: true,

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
