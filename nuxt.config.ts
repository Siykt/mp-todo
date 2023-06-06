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
    MP_TOKEN: '',
    MP_ENCODING_AES_KEY: '',
  },
  appConfig: {
    username: 'AntPro',
  },
  modules: ['@unocss/nuxt'],
  alias: {
    lodash: 'lodash-es',
  },
});
