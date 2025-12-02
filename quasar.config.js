module.exports = configure(function (ctx) {
  return {
    framework: {
      config: {
        dark: false,
        rtl: true
      },
      lang: 'ar'
    },
    build: {
      vueRouterMode: 'history'
    },
    css: [
      'app.scss'
    ]
  }
});