<script setup lang="ts">
const { username = 'AntPro' } = useAppConfig();
</script>
<template>
  <div class="p3">
    <h1 class="text-lg flex items-center">
      <span>{{ username }}-TODO</span>
    </h1>
  </div>
</template>
