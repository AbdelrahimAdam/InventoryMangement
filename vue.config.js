const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  // PWA configuration
  pwa: {
    name: 'نظام إدارة مخزون العطور',
    themeColor: '#4f46e5',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
    }
  },

  // CSS configuration
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        postcssOptions: {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        },
      }
    }
  },

  // Development server configuration
  devServer: {
    port: 8080,
    host: 'localhost',
    hot: true,
    open: true
  },

  // Production configuration
  productionSourceMap: false,

  // Explicit output folder for Vercel
  outputDir: 'dist',

  // Configure Webpack
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  }
});