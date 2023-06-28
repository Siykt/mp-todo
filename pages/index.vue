<script setup lang="ts">
import { useAuth } from '~/lib/hooks/useAuth'

const router = useRouter()
const isShowSettings = useState('isShowSettings', () => false)

const { isLogin } = useAuth()

onMounted(async () => {
  if (!isLogin.value)
    return router.push('/login')
})
</script>

<template>
  <h1 class="m0 flex items-center bg-#e7eaed p3 text-xl font-medium text-#333">
    <a href="https://www.antpro.me/" title="Siykt的博客">
      <img class="mr-6px h-42px w-42px" src="~/assets/logo.png" alt="logo.png">
    </a>
    <span>TODO</span>
  </h1>
  <div v-if="isLogin" class="flex flex-1 gap-2 overflow-hidden p2">
    <Side />
    <Transition name="list">
      <Settings v-if="isShowSettings" />
      <Todos v-else />
    </Transition>
  </div>
  <div v-else class="h-full w-full flex items-center justify-center">
    <i class="rotate-animate mdi:loading text-10 text-#6c6cc9" />
  </div>
</template>
