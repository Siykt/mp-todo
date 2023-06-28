<script setup lang="ts">
import { useAuth } from '~/lib/hooks/useAuth'

const router = useRouter()
const { data: authingUrl } = await useFetch<string>('/api/auth/url')
const { isLogin, setToken } = useAuth()

onMounted(async () => {
  if (isLogin.value)
    return router.push('/')

  async function handleMessage(event: MessageEvent<{ type: string; data: any }>) {
    if (event.data.type === 'up:token') {
      await setToken(event.data.data)
      router.push('/')
    }
  }
  window.addEventListener('message', handleMessage)
  onUnmounted(() => window.removeEventListener('message', handleMessage))
})
</script>

<template>
  <div class="flex flex-1 items-center justify-center overflow-hidden">
    <iframe v-if="authingUrl" class="h-full w-full md:w-450px" :src="authingUrl" frameborder="0" />
  </div>
</template>

<style lang="less" scoped>
// something
</style>
