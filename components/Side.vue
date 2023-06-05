<script setup lang="ts">
import storage from '~/lib/storage';
import { TodoGroup } from '~/modules/Todo/Core';

const sides = ref<TodoGroup[]>([]);
const activeSide = ref<TodoGroup['id']>('');

const init = async () => {
  if (typeof window !== 'undefined') {
    sides.value = await storage.get<TodoGroup[]>('sides', [
      {
        id: 'default',
        title: '默认分组',
        todoCount: 0,
      },
    ]);
    activeSide.value = sides.value[0].id;
  }
};

init();
</script>
<template>
  <div class="w-230px flex flex-col h-full p2 bg-#f3f4f6 rounded-md">
    <div class="flex-1">
      <div v-for="side in sides" :key="side.id" class="side-item" :class="{ active: activeSide === side.id }">
        <i class="mdi:bookshelf"></i>
        <span class="ml-4px">{{ side.title }}</span>
        <span v-if="side.todoCount" class="ml-auto">{{ side.todoCount }}</span>
      </div>
    </div>
    <div class="w-full h-1px bg-#ddd"></div>
    <div class="flex flex-col p2">
      <button class="btn">
        <i class="mdi:plus"></i>
        添加分组
      </button>
      <button class="btn">
        <i class="mdi:cog-outline"></i>
        设置
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.side-item {
  display: flex;
  align-items: center;
  background: transparent;
  padding: 8px;
  color: #666;
  font-size: 15px;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 4px;
  &.active,
  &:hover {
    color: #6c6cc9;
    background: #e7eaed;
  }
}
.btn {
  display: flex;
  align-items: center;
  border: 0;
  padding: 12px;
  padding-left: 0;
  background: transparent;
  gap: 4px;
  color: #333;
  font-size: 15px;
  transition: color 0.3s;
  cursor: pointer;
  &:hover {
    color: #6c6cc9;
  }
}
</style>
