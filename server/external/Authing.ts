import { AuthenticationClient } from 'authing-js-sdk'

const { AUTHING } = useRuntimeConfig()

const authingClient = new AuthenticationClient({
  appId: AUTHING.APP_ID,
  secret: AUTHING.APP_SECRET,
  appHost: `https://${AUTHING.ISSUER}.authing.cn`,
  redirectUri: 'http://localhost:3000/auth/callback',
})

export { authingClient }
