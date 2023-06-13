<script setup lang="ts">
import { useEventListener, useTimeoutFn } from '@vueuse/core'
import { cloneDeep, isEqual } from 'lodash'
import { nanoid } from 'nanoid'
import { useTodosStore } from '~/lib/hooks/useTodoStore'
import type { TodoInfo } from '~/models/Todo/Core'
import { useSettingsStore } from '~/lib/hooks/useSettingsStore'

const { activeTodos, activeSide, upsetTodo, init, deleteTodo } = useTodosStore()

const date = new Date()
const curHour = date.getHours()
const curDay = date.getDay()
const curDate = date.getDate()
const DEFAULT_TODO = { title: '', completed: false, scheduled: { enabled: false } }
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
]

const adding = ref(false)
const newTodo = ref<Omit<TodoInfo, 'id' | 'group'>>(cloneDeep(DEFAULT_TODO))
function addTodo() {
  if (newTodo.value.title) {
    upsetTodo(newTodo.value)
    newTodo.value = cloneDeep(DEFAULT_TODO)
  }
  adding.value = false
}

// 待办事项列表, cloneDeep用于判断是否修改
const todos = computed(() => cloneDeep(activeTodos.value || []))
const collapsedMap = ref(new Set<string>())
const addInputRef = ref<HTMLInputElement>()
function showAddInput() {
  adding.value = true
  // newTodo;
  nextTick(() => {
    addInputRef.value?.focus()
  })
}

async function enabledScheduled(todo: TodoInfo, enabled: boolean) {
  todo.scheduled.enabled = enabled
  if (enabled && !todo.scheduled.config)
    todo.scheduled.config = { id: nanoid(), message: '', cron: CRON_OPTIONS[0].value }

  await updateTodo(todo)
}

// 增量同步scheduled以减少QStash的请求
const incrementTodoMap = ref(new Map<string, TodoInfo>())
const { start, stop } = useTimeoutFn(
  () => {
    // TODO 实现同步scheduled, 需要考虑正在请求中的场景
    incrementTodoMap.value.forEach(async (todo) => {
      await cancelScheduled(todo).catch(err => console.error('[CancelScheduled]', err))
      await addScheduled(todo).catch(err => console.error('[AddScheduled]', err))
      incrementTodoMap.value.delete(todo.id)
    })
  },
  5000,
  { immediate: false },
)
async function updateTodo(todo: TodoInfo) {
  const enabled = !todo.completed && todo.scheduled.enabled
  const oldTodo = activeTodos.value.find(item => item.id === todo.id) as TodoInfo
  // 检查是否修改
  if (isEqual(todo, oldTodo))
    return
  enabled && stop()
  await upsetTodo(todo)
  incrementTodoMap.value.set(todo.id, todo)
  enabled && start()
}

const { settings } = useSettingsStore()
async function addScheduled(todo: TodoInfo) {
  if (todo.completed || !todo.scheduled.enabled || !todo.scheduled.config)
    return
  const { data } = await useFetch('/api/scheduled/add', {
    method: 'POST',
    body: {
      ...todo.scheduled.config,
      authorization: settings.value.authorization,
      body: {
        id: todo.id,
        to: settings.value.email,
        title: todo.title,
        message: todo.scheduled.config.message,
      },
    },
  })
  todo.scheduled.config.scheduleId = data.value?.scheduleId
  await upsetTodo(todo)
}
async function cancelScheduled(todo: TodoInfo) {
  if (!todo.scheduled.config?.scheduleId)
    return
  await useFetch('/api/scheduled/cancel', {
    method: 'POST',
    body: {
      authorization: settings.value.authorization,
      scheduleId: todo.scheduled.config.scheduleId,
    },
  })
  todo.scheduled.config.scheduleId = undefined
  await upsetTodo(todo)
}

const editingItemId = ref<TodoInfo['id']>()
function handleEditTodo(todo: TodoInfo, e?: MouseEvent) {
  const el = e?.target as HTMLElement
  if (el && el.getAttribute('d-name') !== 'title')
    return
  editingItemId.value = todo.id
  nextTick(() => {
    const input = document.querySelector('.todo-item .todo-input') as HTMLInputElement
    input?.focus()
    input?.select()
  })
}

const chooseTodo = ref<TodoInfo>()
const menuRef = ref<HTMLDivElement>()
const showMenu = ref(false)
const position = ref({ x: 0, y: 0 })
function handleCloseMenu(e?: MouseEvent) {
  if (e && menuRef.value?.contains(e.target as Node))
    return
  showMenu.value = false
  chooseTodo.value = undefined
  document.removeEventListener('click', handleCloseMenu)
  document.removeEventListener('dblclick', handleCloseMenu)
  document.removeEventListener('contextmenu', handleCloseMenu)
}
function handleShowMenu(e: MouseEvent, todo: TodoInfo) {
  chooseTodo.value = todo
  e.stopPropagation()
  e.preventDefault()
  showMenu.value = true
  position.value = { x: e.clientX, y: e.clientY }
  document.addEventListener('click', handleCloseMenu, true)
  document.addEventListener('dblclick', handleCloseMenu, true)
  document.addEventListener('contextmenu', handleCloseMenu, true)
}

function handleDeleteTodo() {
  if (!chooseTodo.value)
    return
  cancelScheduled(chooseTodo.value)
  deleteTodo(chooseTodo.value.id)
  handleCloseMenu()
}

init()
onMounted(() => {
  // Tab添加
  useEventListener(document, 'keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      showAddInput()
    }
  })
  // ESC退出
  useEventListener(document, 'keydown', (e) => {
    if (e.key === 'Escape')
      adding.value = false
  })
})
</script>

<template>
  <div class="min-h-0 flex flex-1 flex-col overflow-hidden rounded-md bg-#f3f4f6 p4">
    <h2 class="m0 flex items-center text-18px text-#333">
      <span>{{ activeSide.title }}</span>
      <button class="btn ml-auto" @click="showAddInput">
        <i class="mdi:plus" />
      </button>
      <!-- <button class="ml-1 btn"><i class="mdi:dots-horizontal"></i></button> -->
    </h2>
    <Transition name="list">
      <TransitionGroup
        v-if="activeTodos.length || adding"
        tag="div"
        name="list"
        class="relative mt-4 flex flex-1 flex-col gap-6px overflow-hidden overflow-y-auto"
      >
        <div v-if="adding" class="todo-item-content active">
          <input v-model="newTodo.completed" class="checkbox" type="checkbox">
          <input
            ref="addInputRef"
            v-model="newTodo.title"
            class="todo-input"
            type="text"
            placeholder="请输入TODO标题"
            @blur="addTodo"
            @keyup.enter="addTodo"
          >
        </div>
        <div
          v-for="todo in todos"
          :key="todo.id"
          :class="{
            'completed': todo.completed,
            'mb-190px': collapsedMap.has(todo.id),
            'active': collapsedMap.has(todo.id) || editingItemId === todo.id,
          }"
          class="todo-item"
          @dblclick="handleEditTodo(todo, $event)"
          @contextmenu="handleShowMenu($event, todo)"
        >
          <div class="todo-item-content content">
            <input
              class="checkbox"
              type="checkbox"
              :checked="todo.completed"
              @click="updateTodo({ ...todo, completed: !todo.completed })"
            >
            <p v-if="editingItemId !== todo.id" class="m0 flex-1 text-14px" d-name="title">
              {{ todo.title }}
            </p>
            <input
              v-else
              v-model="todo.title"
              class="todo-input flex-1"
              type="text"
              placeholder="请输入TODO标题"
              @blur="updateTodo(todo), (editingItemId = undefined)"
              @keyup.enter="updateTodo(todo), (editingItemId = undefined)"
            >
            <i
              class="mdi:chevron-up cursor-pointer text-16px transition"
              :class="{ 'transform-rotate-180deg': collapsedMap.has(todo.id), 'cursor-not-allowed': todo.completed }"
              @click="todo.completed || collapsedMap.has(todo.id) ? collapsedMap.delete(todo.id) : collapsedMap.add(todo.id)"
            />
          </div>
          <Transition name="fade">
            <form v-if="collapsedMap.has(todo.id)" class="collapse">
              <div class="form-item w-4/5">
                <div class="label">
                  TODO的详细描述
                </div>
                <AInput
                  v-model="todo.description"
                  type="textarea"
                  placeholder="请输入详细描述"
                  @focus="stop"
                  @blur="updateTodo(todo)"
                />
              </div>
              <div class="form-item flex flex-row items-center gap-2">
                <div class="label">
                  定时邮件推送
                </div>
                <ASwitch v-model="todo.scheduled.enabled" @update:model-value="enabledScheduled(todo, $event)" />
              </div>
              <div v-if="todo.scheduled.enabled && todo.scheduled.config" class="flex flex-col">
                <div class="form-item w-2/5">
                  <div class="label">
                    提示时间
                  </div>
                  <ASelect
                    v-model="todo.scheduled.config.cron"
                    :options="CRON_OPTIONS"
                    placeholder="请选择定期任务配置"
                    @focus="stop"
                    @change="updateTodo(todo)"
                  />
                </div>
                <div class="form-item mb-8px w-4/5">
                  <div class="label">
                    发送的提示消息
                  </div>
                  <AInput
                    v-model="todo.scheduled.config.message"
                    type="textarea"
                    placeholder="请输入发送的提示消息"
                    @focus="stop"
                    @blur="updateTodo(todo)"
                  />
                </div>
              </div>
            </form>
          </Transition>
        </div>
      </TransitionGroup>
      <div v-else class="mt-8 flex flex-col items-center justify-center gap-2">
        <i class="mdi:emoticon-sad-outline text-42px text-#6c6cc9" />
        <span class="text-14px text-#6c6cc9">暂无TODO，使用快捷键 Tab 添加</span>
      </div>
    </Transition>
  </div>
  <Transition name="fade">
    <div
      v-if="showMenu"
      ref="menuRef"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }"
      class="fixed z-10 h70px w86px flex flex-col justify-center rounded bg-#fff shadow-lg transition-duration-200 transition-property-all"
    >
      <button class="menuBtn !px2 !hover:bg-#e7eaed" @click="handleEditTodo(chooseTodo as TodoInfo), handleCloseMenu()">
        <i class="mdi:playlist-edit" />
        编辑
      </button>
      <button class="menuBtn !px2 !hover:bg-#e7eaed" @click="handleDeleteTodo()">
        <i class="mdi:delete-sweep-outline" />
        删除
      </button>
    </div>
  </Transition>
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
.menuBtn {
  display: flex;
  align-items: center;
  border: 0;
  height: 40px;
  padding-left: 0;
  background: transparent;
  gap: 4px;
  color: #333;
  font-size: 15px;
  transition: color 0.3s, background 0.3s;
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
    padding: 0;
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
  transition: all 0.3s ease;
  user-select: none;
  flex: 0 0 42px;
  .content {
    height: 100%;
    // cursor: pointer;
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
      background: #e7eaed;
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
    height: 178px;
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
