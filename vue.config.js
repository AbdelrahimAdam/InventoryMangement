const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  
  transpileDependencies: true,
  productionSourceMap: false,
  
  // PWA Configuration - FIXED: Proper object structure
  pwa: {
    name: 'نظام إدارة المخازن - البران للعطور',
    short_name: 'إدارة المخازن',
    themeColor: '#3b82f6',
    backgroundColor: '#ffffff',
    msTileColor: '#3b82f6',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    
    // Workbox configuration
    workboxPluginMode: 'GenerateSW',
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      exclude: [/\.map$/, /manifest\.json$/],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets'
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30
            }
          }
        }
      ]
    },
    
    // Icon paths
    iconPaths: {
      favicon32: 'img/icons/favicon-32x32.png',
      favicon16: 'img/icons/favicon-16x16.png',
      appleTouchIcon: 'img/icons/apple-touch-icon-152x152.png',
      maskIcon: 'img/icons/safari-pinned-tab.svg',
      msTileImage: 'img/icons/msapplication-icon-144x144.png'
    }
  },
  
  // CSS configuration
  css: {
    extract: true,
    sourceMap: false,
    loaderOptions: {
      css: {
        url: false // Disable url() handling in CSS
      }
    }
  },
  
  // Webpack optimization
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'async',
            priority: 5,
            reuseExistingChunk: true,
            enforce: true
          }
        }
      },
      runtimeChunk: {
        name: 'runtime'
      }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  },
  
  // Chain webpack for additional configuration
  chainWebpack: config => {
    // Remove prefetch and preload plugins
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    
    // Optimize HTML
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        title: 'نظام إدارة المخازن - البران للعطور',
        meta: {
          viewport: 'width=device-width,initial-scale=1.0',
          description: 'نظام متكامل لإدارة مخازن زجاج العطور - البران للعطور',
          'theme-color': '#3b82f6'
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true
        }
      };
      return args;
    });
    
    // Handle images
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => ({
        ...options,
        limit: 4096,
        name: 'img/[name].[hash:8].[ext]'
      }));
      
    // Handle fonts
    config.module
      .rule('fonts')
      .use('url-loader')
      .tap(options => ({
        ...options,
        limit: 4096,
        name: 'fonts/[name].[hash:8].[ext]'
      }));
  },
  
  // Dev server configuration
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  }
});
