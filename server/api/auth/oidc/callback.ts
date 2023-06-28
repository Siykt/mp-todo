import { CacheKeys, redis, serialize } from '../../../common/redis'
import { authingClient } from '../../../external/Authing'

const SESSION_EXPIRES = 3600 * 24 * 7

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (!query.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'code is required',
    })
  }

  const tokenSet = await authingClient.getAccessTokenByCode(query.code as string)
  const { access_token, id_token } = tokenSet
  const userInfo = await authingClient.getUserInfoByAccessToken(access_token)
  const token = CacheKeys.genUserSessionToken(userInfo.sub)
  await redis.set(CacheKeys.userSession(token), serialize({ userInfo, token, id_token }), 'EX', SESSION_EXPIRES)
  return { token, userInfo }
})
