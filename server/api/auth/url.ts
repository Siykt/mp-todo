import { authingClient } from '../../external/Authing'

export default defineEventHandler(() => {
  return authingClient.buildAuthorizeUrl()
})
