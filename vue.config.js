const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
    },
  },
  configureWebpack: {
    plugins: [new MonacoWebpackPlugin()],
  },
};
