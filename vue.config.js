const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',   // Required for routing in SPA
  outputDir: 'dist', // Vercel detects this

  transpileDependencies: true,
  productionSourceMap: false
});