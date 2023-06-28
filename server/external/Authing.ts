import { AuthenticationClient } from 'authing-js-sdk'

const { AUTHING, NUXT_APP_DOMAIN } = useRuntimeConfig()

const authingClient = new AuthenticationClient({
  appId: AUTHING.APP_ID,
  secret: AUTHING.APP_SECRET,
  appHost: `https://${AUTHING.ISSUER}.authing.cn`,
  redirectUri: `${NUXT_APP_DOMAIN}/auth/callback`,
})

export { authingClient }
