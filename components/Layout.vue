<script setup lang="ts">
// something
</script>
<template>
  <div class="w-screen h-screen relative flex">
    <div class="absolute top-0 left-0 bottom-0 right-0 bg bg-center bg-cover w-screen h-screen"></div>
    <div class="absolute top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-75 w-screen h-screen"></div>
    <div class="flex m-auto bg-white w-screen h-screen sm:flex-col md:flex-row md:h-auto md:max-w-5xl md:rounded-md relative z-1">
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
.bg {
  background-image: url(/assets/bg.png);
  filter: blur(20px);
}
</style>
