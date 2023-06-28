import { AuthenticationClient } from 'authing-js-sdk'

const { AUTHING, APP_DOMAIN } = useRuntimeConfig()

const authingClient = new AuthenticationClient({
  appId: AUTHING.APP_ID,
  secret: AUTHING.APP_SECRET,
  appHost: `https://${AUTHING.ISSUER}.authing.cn`,
  redirectUri: `${APP_DOMAIN}/auth/callback`,
})

export { authingClient }
