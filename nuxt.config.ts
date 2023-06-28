// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
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
    UPSTASH_REDIS_PATH: '',
    QSTASH_AUTHORIZATION: '',
    RECEIVE_EMAIL: '',
    AUTHING: {
      APP_ID: '',
      APP_SECRET: '',
      ISSUER: '',
    },
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
  modules: ['@unocss/nuxt', '@nuxtjs/eslint-module'],
  eslint: {
    lintOnStart: false,
  },
  alias: {
    lodash: 'lodash-es',
  },
})
