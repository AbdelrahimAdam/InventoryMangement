pwa: {
  name: 'نظام إدارة المخازن - منوفيا للعطور',
  short_name: 'إدارة المخازن',
  themeColor: '#3b82f6',
  backgroundColor: '#ffffff',
  msTileColor: '#3b82f6',
  appleMobileWebAppCapable: 'yes',
  appleMobileWebAppStatusBarStyle: 'black-translucent',
  
  // IMPORTANT: Use InjectManifest mode since you have a custom service worker
  workboxPluginMode: 'InjectManifest',
  workboxOptions: {
    // Point to your custom service worker file
    swSrc: 'public/service-worker.js',
    swDest: 'service-worker.js',
    exclude: [
      /\.map$/,
      /manifest\.json$/,
      /_redirects/,
      /_headers/
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
    faviconSVG: 'img/icons/favicon.svg',
    favicon32: 'img/icons/favicon-32x32.png',
    favicon16: 'img/icons/favicon-16x16.png',
    appleTouchIcon: 'img/icons/apple-touch-icon.png',
    maskIcon: 'img/icons/safari-pinned-tab.svg',
    msTileImage: 'img/icons/mstile-150x150.png'
  }
},
