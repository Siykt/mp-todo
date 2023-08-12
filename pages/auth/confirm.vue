<script setup lang="ts">
const user = useSupabaseUser()

watch(user, () => {
  if (user.value)
    return navigateTo('/')
}, { immediate: true })
</script>

<template>
  <div class="h-full w-full flex items-center justify-center">
    <i class="rotate-animate mdi:loading text-10 text-#6c6cc9" />
  </div>
</template>
