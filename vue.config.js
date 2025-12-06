const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  publicPath: '/',
  outputDir: 'dist',
  
  transpileDependencies: true,
  productionSourceMap: false,
  
  // CSS configuration - ensure proper extraction
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
        title: 'نظام إدارة مخازن منوفيا للعطور',
        meta: {
          viewport: 'width=device-width,initial-scale=1.0',
          description: 'نظام متكامل لإدارة مخازن زجاج العطور - منوفيا للعطور',
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
