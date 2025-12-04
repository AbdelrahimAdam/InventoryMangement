const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',         // REQUIRED for Vercel
  outputDir: 'dist',       // Vercel detects this

  transpileDependencies: true,

  // PWA configuration
  pwa: {
    name: 'نظام إدارة مخزون العطور',
    themeColor: '#4f46e5',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',

    // SAFE MODE (InjectManifest causes white screen if SW has any error)
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      // default options
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
  }
});