<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { useTodosStore } from '~/lib/hooks/useTodoStore';
import { TodoInfo } from '~/modules/Todo/Core';
const { activeTodos, activeSide, upsetTodo, init } = useTodosStore();

const adding = ref(false);
const newTodo = ref<Omit<TodoInfo, 'id' | 'group'>>({ title: '', completed: false });
const addTodo = () => {
  if (newTodo.value.title) {
    upsetTodo(newTodo.value);
    newTodo.value = { title: '', completed: false };
  }
  adding.value = false;
};

const addInputRef = ref<HTMLInputElement>();
const showAddInput = () => {
  adding.value = true;
  // newTodo;
  nextTick(() => {
    addInputRef.value?.focus();
  });
};

init();
onMounted(() => {
  // Tab添加
  useEventListener(document, 'keydown', e => {
    if (e.key === 'Tab') {
      e.preventDefault();
      showAddInput();
    }
  });
  // ESC退出
  useEventListener(document, 'keydown', e => {
    if (e.key === 'Escape') {
      adding.value = false;
    }
  });
});
</script>
<template>
  <div class="flex flex-col flex-1 bg-#f3f4f6 rounded-md p4 min-h-0 overflow-hidden">
    <h2 class="m0 text-18px text-#333 flex items-center">
      <span>{{ activeSide.title }}</span>
      <button class="ml-auto btn" @click="showAddInput"><i class="mdi:plus"></i></button>
      <button class="ml-1 btn"><i class="mdi:dots-horizontal"></i></button>
    </h2>
    <Transition name="list">
      <TransitionGroup
        tag="div"
        name="list"
        v-if="activeTodos.length || adding"
        class="flex-1 flex relative flex-col gap-6px mt-4 overflow-hidden overflow-y-auto"
      >
        <div class="todo-item active" v-if="adding">
          <input class="checkbox" type="checkbox" v-model="newTodo.completed" />
          <input
            ref="addInputRef"
            class="todo-input"
            type="text"
            v-model="newTodo.title"
            placeholder="请输入TODO标题"
            @blur="addTodo"
            @keyup.enter="addTodo"
          />
        </div>
        <div class="todo-item" v-for="todo in activeTodos" :class="{ completed: todo.completed }">
          <input class="checkbox" type="checkbox" v-model="todo.completed" />
          <p class="m0 text-14px flex-1">{{ todo.title }}</p>
        </div>
      </TransitionGroup>
      <div v-else class="flex flex-col items-center justify-center gap-2 mt-8">
        <i class="mdi:emoticon-sad-outline text-#6c6cc9 text-42px"></i>
        <span class="text-#6c6cc9 text-14px">暂无TODO，使用快捷键 Tab 添加</span>
      </div>
    </Transition>
  </div>
</template>
<style lang="less" scoped>
.btn {
  color: #666;
  font-size: 20px;
  padding: 0;
  border: 0;
  transition: all 0.3s;
  background: transparent;
  cursor: pointer;
  &:hover {
    color: #6c6cc9;
  }
}
.todo-item {
  display: flex;
  width: 100%;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  transition: all 0.3s;
  height: 42px;
  gap: 8px;
  user-select: none;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  .checkbox {
    cursor: pointer;
  }
  &.active,
  &:hover {
    background: rgba(108, 108, 201, 0.1);
  }
  .todo-input {
    border: 0;
    transition: all 0.3s;
    background: transparent;
    &:focus {
      outline: none;
    }
  }
  &.completed {
    text-decoration: line-through;
    color: #c2bfbf;
  }
}
</style>
