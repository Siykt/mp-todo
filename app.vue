<script setup lang="ts">
import '@unocss/reset/sanitize/sanitize.css';
import '@unocss/reset/sanitize/assets.css';
import '~/styles/global.less';
</script>
<template>
  <Layout>
    <NuxtPage />
  </Layout>
</template>
<style scoped>
.bg {
  background-image: url(/assets/bg.png);
  filter: blur(20px);
}
</style>
