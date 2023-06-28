<script setup lang="ts">
const route = useRoute()
// const router = useRouter()

onMounted(async () => {
  await nextTick()
  const { data } = await useFetch('/api/auth/oidc/callback', {
    params: { code: route.query.code },
  })
  if (!data.value)
    return
  window.top?.postMessage({ type: 'up:token', data: data.value.token }, '*')
})
</script>

<template>
  <div class="h-full w-full flex items-center justify-center">
    <i class="rotate-animate mdi:loading text-10 text-#6c6cc9" />
  </div>
</template>

<style lang="less" scoped>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
.rotate-animate {
  animation: rotate 1s linear infinite;
}
</style>
