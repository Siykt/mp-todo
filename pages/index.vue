<script setup lang="ts">
import LogoPNG from '@/assets/logo.png';
</script>
<template>
  <h1 class="p2 flex items-center m0 text-xl font-medium text-#333 bg-#e7eaed">
    <img class="w-60px h-60px mr-6px" :src="LogoPNG" alt="logo.png" />
    <span>TODO</span>
  </h1>
  <div class="p2 flex flex-1">
    <Side />
  </div>
</template>
