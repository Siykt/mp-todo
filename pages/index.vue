<script setup lang="ts">
import LogoPNG from '~/assets/logo.png';

const isShowSettings = useState('isShowSettings', () => false);

const auth = useState('settingAuth', () => false);
onMounted(async () => {
  if (auth.value) return;
  const { data } = await useFetch('/api/checkAuth');
  auth.value = data.value || false;
});
</script>
<template>
  <h1 class="flex items-center text-xl font-medium text-#333 p3 m0 bg-#e7eaed">
    <a href="https://www.antpro.me/" title="Siykt的博客">
      <img class="w-42px h-42px mr-6px" :src="LogoPNG" alt="logo.png" />
    </a>
    <span>TODO</span>
  </h1>
  <div class="p2 flex flex-1 gap-2 overflow-hidden">
    <Side />
    <Transition name="list">
      <Settings v-if="isShowSettings" />
      <Todos v-else="isShowSettings" />
    </Transition>
  </div>
</template>
