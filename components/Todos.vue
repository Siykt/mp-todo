<script setup lang="ts">
import { useEventListener } from '@vueuse/core';
import { useTodosStore } from '~/lib/hooks/useTodoStore';
import { TodoInfo } from '~/modules/Todo/Core';
import { cloneDeep } from 'lodash';
import { nanoid } from 'nanoid';

const { activeTodos, activeSide, upsetTodo, init } = useTodosStore();

const date = new Date();
const curHour = date.getHours();
const curDay = date.getDay();
const curDate = date.getDate();
const DEFAULT_TODO = { title: '', completed: false, scheduled: { enabled: false } };
const CRON_OPTIONS = [
  {
    label: '每天',
    value: `0 ${curHour} * * *`,
  },
  {
    label: '每周',
    value: `0 ${curHour} * * ${curDay === 7 ? 0 : curDate}}`,
  },
  {
    label: '每月',
    value: `0 ${curHour} ${curDate} * *`,
  },
];

const adding = ref(false);
const newTodo = ref<Omit<TodoInfo, 'id' | 'group'>>(cloneDeep(DEFAULT_TODO));
const addTodo = () => {
  if (newTodo.value.title) {
    upsetTodo(newTodo.value);
    newTodo.value = cloneDeep(DEFAULT_TODO);
  }
  adding.value = false;
};

type TodoItem = TodoInfo & { collapsed: boolean };
const todos = computed<TodoItem[]>(() =>
  activeTodos.value.map(todo => {
    (todo as TodoItem).collapsed = false;
    return todo as TodoItem;
  })
);

const addInputRef = ref<HTMLInputElement>();
const showAddInput = () => {
  adding.value = true;
  // newTodo;
  nextTick(() => {
    addInputRef.value?.focus();
  });
};

const enabledScheduled = (todo: TodoItem, enabled: boolean) => {
  todo.scheduled.enabled = enabled;
  if (enabled && !todo.scheduled.config) {
    todo.scheduled.config = { id: nanoid(), message: '', cron: CRON_OPTIONS[0].value };
  }
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
        <div class="todo-item-content active" v-if="adding">
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
        <div
          class="todo-item"
          v-for="todo in todos"
          :class="{ completed: todo.completed, 'mb-192px': todo.collapsed, active: todo.collapsed }"
        >
          <div class="todo-item-content content">
            <input class="checkbox" type="checkbox" v-model="todo.completed" />
            <p class="m0 text-14px flex-1">{{ todo.title }}</p>
            <i
              class="mdi:chevron-up text-16px transition"
              :class="{ 'transform-rotate-180deg': todo.collapsed }"
              @click="todo.collapsed = !todo.collapsed"
            />
          </div>
          <Transition name="fade">
            <form v-if="todo.collapsed" class="collapse">
              <div class="form-item w-4/5">
                <div class="label">TODO的详细描述</div>
                <AInput v-model="todo.description" type="textarea" placeholder="请输入详细描述" />
              </div>
              <div class="form-item flex flex-row items-center gap-2">
                <div class="label">定时邮件推送</div>
                <ASwitch v-model="todo.scheduled.enabled" @update:modelValue="enabledScheduled(todo, $event)" />
              </div>
              <div v-if="todo.scheduled.enabled && todo.scheduled.config" class="flex flex-col">
                <div class="form-item w-2/5">
                  <div class="label">提示时间</div>
                  <ASelect v-model="todo.scheduled.config.cron" :options="CRON_OPTIONS" placeholder="请选择定期任务配置" />
                </div>
                <div class="form-item w-4/5 mb-8px">
                  <div class="label">发送的提示消息</div>
                  <AInput v-model="todo.scheduled.config.message" type="textarea" placeholder="请输入发送的提示消息" />
                </div>
              </div>
            </form>
          </Transition>
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
.todo-item-content {
  width: 100%;
  display: flex;
  flex: 0 0 42px;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  transition: all 0.3s;
  gap: 8px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  .todo-input {
    margin-left: -1px;
    border: 0;
    font-size: 14px;
    transition: all 0.3s;
    background: transparent;
    &:focus {
      outline: none;
    }
  }
}
.todo-item {
  position: relative;
  width: 100%;
  transition: all 0.3s;
  user-select: none;
  flex: 0 0 42px;
  .content {
    height: 100%;
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
  }
  .checkbox {
    cursor: pointer;
  }
  &.active,
  &:hover {
    .content {
      background: #e6e6f1;
    }
  }
  &.completed {
    text-decoration: line-through;
    color: #c2bfbf;
  }
  .collapse {
    position: absolute;
    left: 8px;
    padding-bottom: 0;
    top: 42px;
    height: 180px;
    background-color: #fff;
    width: calc(100% - 16px);
    overflow: auto;
    background: #ffffff;
    box-shadow: 1px 2px 8px 0px rgba(39, 112, 128, 0.2);
    border-radius: 0px 0px 4px 4px;
    z-index: 1;
    padding: 8px 16px;
    box-sizing: border-box;
    .form-item {
      padding-bottom: 4px;
      padding-top: 2px;
      .label {
        font-weight: bold;
        font-size: 12px;
        color: rgb(107, 119, 140);
        line-height: 30px;
      }
    }
  }
}
</style>
