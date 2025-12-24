const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  
  transpileDependencies: true,
  productionSourceMap: false,
  
  // PWA Configuration - UPDATED FOR CUSTOM SERVICE WORKER
  pwa: {
    name: 'نظام إدارة المخازن - البران للعطور',
    short_name: 'المخزون',
    themeColor: '#3b82f6',
    backgroundColor: '#ffffff',
    msTileColor: '#3b82f6',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
    
    // DISABLE AUTO-GENERATED SERVICE WORKER
    // We're using our own custom service worker
    workboxPluginMode: 'InjectManifest', // Changed from 'GenerateSW' to 'InjectManifest'
    workboxOptions: {
      // Path to our custom service worker
      swSrc: 'public/service-worker.js', // Your custom service worker
      swDest: 'service-worker.js',       // Output file
      
      // Don't auto-register - we'll handle registration manually
      skipWaiting: false,
      clientsClaim: false,
      
      // Clean up old caches
      cleanupOutdatedCaches: true,
      
      // Exclude files from precaching
      exclude: [
        /\.map$/,
        /manifest\.json$/,
        /\.htaccess$/,
        /\.DS_Store$/,
        /service-worker\.js\.map$/
      ],
      
      // Additional precache manifest entries
      additionalManifestEntries: [
        { url: '/', revision: 'v1' },
        { url: '/index.html', revision: 'v1' }
      ],
      
      // Runtime caching strategies
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'google-fonts-stylesheets',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-webfonts',
            expiration: {
              maxEntries: 20,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            }
          }
        },
        {
          urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
          handler: 'CacheFirst',
          options: {
            cacheName: 'images',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
            }
          }
        },
        {
          urlPattern: /\.(?:js|css)$/,
          handler: 'StaleWhileRevalidate',
          options: {
            cacheName: 'static-resources',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
            }
          }
        },
        // Firebase/Firestore caching
        {
          urlPattern: /^https:\/\/(?:[^\/]+\.)?(firestore\.googleapis\.com|firebaseio\.com)\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'firebase-data',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 5 // 5 minutes for fresh data
            }
          }
        },
        // API calls
        {
          urlPattern: /\/api\/.*/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-calls',
            networkTimeoutSeconds: 10,
            expiration: {
              maxEntries: 30,
              maxAgeSeconds: 60 * 5 // 5 minutes
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
    },
    
    // Manifest options
    manifestOptions: {
      name: 'نظام إدارة المخازن - البران للعطور',
      short_name: 'المخزون',
      description: 'نظام متكامل لإدارة مخازن زجاج العطور - البران للعطور',
      theme_color: '#3b82f6',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: './img/icons/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: './img/icons/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: './img/icons/apple-touch-icon-152x152.png',
          sizes: '152x152',
          type: 'image/png'
        }
      ]
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
      },
      minimize: true,
      minimizer: [
        {
          apply: compiler => {
            // Terser plugin configuration
            const TerserPlugin = require('terser-webpack-plugin');
            new TerserPlugin({
              terserOptions: {
                compress: {
                  drop_console: process.env.NODE_ENV === 'production' // Remove console.log in production
                }
              }
            }).apply(compiler);
          }
        }
      ]
    },
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    },
    plugins: []
  },
  
  // Chain webpack for additional configuration
  chainWebpack: config => {
    // Remove prefetch and preload plugins for better loading
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
    
    // Optimize HTML
    config.plugin('html').tap(args => {
      args[0] = {
        ...args[0],
        title: 'نظام إدارة المخازن - البران للعطور',
        meta: {
          viewport: 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no',
          description: 'نظام متكامل لإدارة مخازن زجاج العطور - البران للعطور',
          'theme-color': '#3b82f6',
          'mobile-web-app-capable': 'yes',
          'apple-mobile-web-app-capable': 'yes',
          'apple-mobile-web-app-status-bar-style': 'black-translucent'
        },
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: false,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
          minifyCSS: true,
          minifyJS: true
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
        limit: 8192, // Increased to 8KB
        name: 'img/[name].[hash:8].[ext]',
        esModule: false
      }));
      
    // Handle fonts
    config.module
      .rule('fonts')
      .use('url-loader')
      .tap(options => ({
        ...options,
        limit: 8192,
        name: 'fonts/[name].[hash:8].[ext]',
        esModule: false
      }));
      
    // SVG handling
    config.module
      .rule('svg')
      .test(/\.(svg)(\?.*)?$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'img/[name].[hash:8].[ext]'
      });
      
    // Performance hints
    config.performance.hints(false);
    
    // Define environment variables
    config.plugin('define').tap((definitions) => {
      definitions[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL || '/');
      return definitions;
    });
    
    // Copy service worker and manifest to dist
    config.plugin('copy').tap(([options]) => {
      options.patterns.push(
        {
          from: 'public/service-worker.js',
          to: 'service-worker.js',
          toType: 'file'
        },
        {
          from: 'public/manifest.json',
          to: 'manifest.json',
          toType: 'file'
        },
        {
          from: 'public/img/icons',
          to: 'img/icons',
          toType: 'dir'
        }
      );
      return [options];
    });
  },
  
  // Dev server configuration
  devServer: {
    host: 'localhost',
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: {
      rewrites: [
        { from: /^\/service-worker\.js$/, to: '/service-worker.js' },
        { from: /./, to: '/index.html' }
      ]
    },
    client: {
      overlay: {
        warnings: false,
        errors: true
      },
      progress: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization, Cache-Control',
      'Service-Worker-Allowed': '/'
    },
    devMiddleware: {
      writeToDisk: true // Write files to disk for service worker testing
    }
  },
  
  // Plugin configuration
  pluginOptions: {
    // Disable automatic PWA registration (we handle it manually)
    autoRouting: {
      chunkNamePrefix: 'page-'
    }
  },
  
  // Filename hashing for cache busting
  filenameHashing: true,
  
  // Asset handling
  assetsDir: 'assets',
  
  // Parallel processing
  parallel: require('os').cpus().length > 1
});
