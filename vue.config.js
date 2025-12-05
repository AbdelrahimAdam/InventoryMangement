const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: 'dist',
  
  transpileDependencies: true,

  // PWA configuration - DISABLED FOR VERCEL
  // pwa: {
  //   name: 'نظام إدارة مخزون العطور',
  //   themeColor: '#4f46e5',
  //   msTileColor: '#000000',
  //   appleMobileWebAppCapable: 'yes',
  //   appleMobileWebAppStatusBarStyle: 'black',
  //   workboxPluginMode: 'GenerateSW',
  //   workboxOptions: {
  //     skipWaiting: true,
  //     clientsClaim: true,
  //     cleanupOutdatedCaches: true,
  //   }
  // },

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

  productionSourceMap: false,

  // Webpack optimizations
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
  },

  // Chain webpack for better optimization
  chainWebpack: config => {
    config.optimization.minimize(true);
    
    // Remove PWA plugin for Vercel
    config.plugins.delete('pwa');
    config.plugins.delete('workbox');
  }
});