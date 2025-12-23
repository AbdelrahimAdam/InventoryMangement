const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  
  transpileDependencies: true,
  productionSourceMap: false,
  
  // PWA Configuration - UPDATED for src/serviceworker
  pwa: {
    name: 'نظام إدارة المخازن - منوفيا للعطور',
    short_name: 'إدارة المخازن',
    themeColor: '#3b82f6',
    backgroundColor: '#ffffff',
    msTileColor: '#3b82f6',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    
    // IMPORTANT: Use InjectManifest mode for custom service worker in src/
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // Point to your service worker in src folder
      swSrc: 'src/serviceworker',
      swDest: 'service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/,
        /_redirects/,
        /_headers/
      ],
      
      // Additional Workbox options
      skipWaiting: true,
      clientsClaim: true,
      cleanupOutdatedCaches: true,
      
      // Navigation fallback for SPA
      navigateFallback: '/index.html',
      navigateFallbackAllowlist: [/^(?!\/__).*/],
      
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
    
    // Manifest options
    manifestOptions: {
      name: 'نظام إدارة المخازن - منوفيا للعطور',
      short_name: 'إدارة المخازن',
      start_url: '/',
      display: 'standalone',
      theme_color: '#3b82f6',
      background_color: '#ffffff',
      icons: [
        {
          src: '/img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ],
      lang: 'ar',
      dir: 'rtl'
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
        url: false
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
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    
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
    
    config.module
      .rule('images')
      .use('url-loader')
      .tap(options => ({
        ...options,
        limit: 4096,
        name: 'img/[name].[hash:8].[ext]'
      }));
      
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
