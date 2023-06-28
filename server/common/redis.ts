import Redis from 'ioredis'
import { cloneDeep } from 'lodash'
import { SafeJsonType } from 'safe-json-type'

const { UPSTASH_REDIS_PATH } = useRuntimeConfig()

const redis = new Redis(UPSTASH_REDIS_PATH)

export function serialize(value: any) {
  return SafeJsonType.stringify(cloneDeep(value))
}

export function deserialize<T = any>(value: string) {
  return SafeJsonType.parse(value) as T
}

export const CacheKeys = {
  userSession: (token: string) => `USER:${token}`,
  genUserSessionToken: (userId: string) => `${userId}`,
}

export const CacheCleaners = {
  userSession: (userId: string) => redis.del(`USER:${userId}:*`),
}

export { redis }
