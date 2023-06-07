// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'AntPro Todo',
      meta: [{ charset: 'utf-8' }, { name: 'viewport', content: 'width=device-width,initial-scale=1' }],
      htmlAttrs: {
        lang: 'zh-CN',
      },
    },
  },
  runtimeConfig: {
    QSTASH_AUTHORIZATION: '',
    SMTP: {
      Host: '',
      Port: '',
      TLS: '',
      User: '',
      Pass: '',
      From: '',
    },
  },
  appConfig: {
    username: 'AntPro',
  },
  modules: ['@unocss/nuxt'],
  alias: {
    lodash: 'lodash-es',
  },
});
