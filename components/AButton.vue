<script setup lang="ts">
defineEmits<{
  (event: 'click', payload: MouseEvent): void
}>()
</script>

<template>
  <button class="btn rounded-md p3" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<style lang="less" scoped>
.btn {
  border: 1px solid #6c6cc9;
  background: transparent;
  cursor: pointer;
  color: #6c6cc9cc;
  transition: all 0.3s;
  &:hover {
    color: #6c6cc9;
  }
}
</style>
