<script setup lang="ts">
// something
</script>
<template>
  <div class="w-screen h-screen relative flex content">
    <div class="absolute top-0 left-0 bottom-0 right-0 bg bg-center bg-cover w-screen h-screen"></div>
    <div class="absolute top-0 left-0 bottom-0 right-0 bg-gray-800 bg-opacity-75 w-screen h-screen"></div>
    <div
      class="flex mx-auto md:my-15vh bg-white w-screen h-screen flex-col md:h-auto md:w-3xl md:rounded-md relative z-1 overflow-hidden"
    >
      <slot />
    </div>
  </div>
</template>

<style lang="less" scoped>
// @import url('https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap');
.content {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
}
.bg {
  background-image: url(/assets/bg.png);
  filter: blur(20px);
}
</style>
