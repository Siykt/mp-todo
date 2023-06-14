<script setup lang="ts">
import LogoPNG from '~/assets/logo.png'

const isShowSettings = useState('isShowSettings', () => false)

const auth = useState('settingAuth', () => false)
onMounted(async () => {
  if (auth.value)
    return
  const { data } = await useFetch('/api/checkAuth')
  auth.value = data.value || false
})
</script>

<template>
  <h1 class="m0 flex items-center bg-#e7eaed p3 text-xl font-medium text-#333">
    <a href="https://www.antpro.me/" title="Siykt的博客">
      <img class="mr-6px h-42px w-42px" :src="LogoPNG" alt="logo.png">
    </a>
    <span>TODO</span>
  </h1>
  <div class="flex flex-1 gap-2 overflow-hidden p2">
    <Side />
    <Transition name="list">
      <Settings v-if="isShowSettings" />
      <Todos v-else />
    </Transition>
  </div>
</template>
