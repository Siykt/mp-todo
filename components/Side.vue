<script setup lang="ts">
import { useToast } from '~/lib/hooks/useToast'
import { useSidesStore } from '~/lib/hooks/useTodoStore'

const { init, sides, activeSide, upsetSide, deleteSide } = useSidesStore()

const adding = ref(false)
const sidesRef = ref<HTMLDivElement>()
const addInputRef = ref<HTMLInputElement>()
function showAddInput() {
  adding.value = true
  nextTick(() => {
    if (!sidesRef.value)
      return
    sidesRef.value.scroll({ top: sidesRef.value.scrollHeight, behavior: 'smooth' })
    // focus会导致滚动状态停止, 所以需要动态的调整focus的时机
    // https://stackoverflow.com/questions/64611389/scroll-duration-for-behaviour-smooth-in-different-browsers
    setTimeout(() => {
      addInputRef.value?.focus()
    }, (sidesRef.value.scrollHeight - sidesRef.value.scrollTop) / 3 + 100)
  })
}

const sideTitle = ref('')
async function addSide() {
  if (sideTitle.value) {
    activeSide.value = await upsetSide({ title: sideTitle.value })
    sideTitle.value = ''
  }
  adding.value = false
  nextTick(() => {
    sidesRef.value?.scroll({ top: sidesRef.value?.scrollHeight, behavior: 'smooth' })
  })
}

const isShowSettings = useState('isShowSettings', () => false)

const editingSideId = ref('')
function handleEditSide(sideId: string, e?: MouseEvent) {
  if ((e?.target as HTMLElement)?.tagName === 'INPUT')
    return
  editingSideId.value = sideId
  nextTick(() => {
    const input = document.querySelector('.side-item input') as HTMLInputElement
    input.focus()
    input.select()
  })
}

const toast = useToast()
const chooseSideId = ref('')
const menuRef = ref<HTMLDivElement>()
const showMenu = ref(false)
const position = ref({ x: 0, y: 0 })
function handleCloseMenu(e?: MouseEvent) {
  if (e && menuRef.value?.contains(e.target as Node))
    return
  showMenu.value = false
  chooseSideId.value = ''
  document.removeEventListener('click', handleCloseMenu)
  document.removeEventListener('dblclick', handleCloseMenu)
  document.removeEventListener('contextmenu', handleCloseMenu)
}
function handleShowMenu(e: MouseEvent, sideId: string) {
  chooseSideId.value = sideId
  e.stopPropagation()
  e.preventDefault()
  showMenu.value = true
  position.value = { x: e.clientX, y: e.clientY }
  document.addEventListener('click', handleCloseMenu, true)
  document.addEventListener('dblclick', handleCloseMenu, true)
  document.addEventListener('contextmenu', handleCloseMenu, true)
}

function handleDeleteSide() {
  if (!chooseSideId.value)
    return
  if (sides.value.length === 1) {
    toast.info('至少保留一个分组')
    handleCloseMenu()
    return
  }
  deleteSide(chooseSideId.value)
  handleCloseMenu()
}

init()
onMounted(() => {
  sidesRef.value?.scroll({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="h-full min-h-0 w-230px flex flex-col items-start rounded-md bg-#f3f4f6 py2">
    <div ref="sidesRef" class="relative w-full flex flex-1 flex-col overflow-hidden overflow-y-auto px2">
      <TransitionGroup v-if="sides.length" name="list">
        <div
          v-for="side in sides"
          :key="side.id"
          class="side-item"
          :class="{ 'active': activeSide.id === side.id, 'disabled': isShowSettings, '!p0': editingSideId === side.id }"
          @click="!isShowSettings && (activeSide = side)"
          @dblclick="handleEditSide(side.id, $event)"
          @contextmenu="handleShowMenu($event, side.id)"
        >
          <template v-if="editingSideId !== side.id">
            <i class="mdi:bookshelf" />
            <span v-if="editingSideId !== side.id" class="ml-4px flex-1">{{ side.title }}</span>
            <span v-if="side.total" class="ml-auto">{{ side.total }}</span>
          </template>
          <input
            v-else
            v-model="side.title"
            class="add-input !mb0"
            @blur="upsetSide(side), (editingSideId = '')"
            @keyup.enter="upsetSide(side), (editingSideId = '')"
          >
        </div>
        <div v-if="adding" key="addInput" class="relative">
          <i class="mdi:plus absolute left-2 top-50% translate-y--50% text-#6c6cc9" />
          <input
            ref="addInputRef"
            v-model="sideTitle"
            class="add-input"
            placeholder="添加一个分组"
            @blur="addSide"
            @keyup.enter="addSide"
          >
        </div>
      </TransitionGroup>
    </div>
    <div class="my2 h-1px w-full px-2">
      <div class="h-full w-full bg-#ddd" />
    </div>
    <div class="w-full flex flex-col px4 py2">
      <button key="plus" class="btn" @click="showAddInput">
        <i class="mdi:plus" />
        添加分组
      </button>
      <button v-if="!isShowSettings" key="settings" class="btn" @click="isShowSettings = true">
        <i class="mdi:cog-outline" />
        设置
      </button>
      <button v-else key="todo" class="btn" @click="isShowSettings = false">
        <i class="mdi:format-list-group-plus" />
        TODOS
      </button>
    </div>
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
      <button class="btn !px2 !hover:bg-#e7eaed" @click="handleEditSide(chooseSideId), handleCloseMenu()">
        <i class="mdi:playlist-edit" />
        编辑
      </button>
      <button class="btn !px2 !hover:bg-#e7eaed" @click="handleDeleteSide()">
        <i class="mdi:delete-sweep-outline" />
        删除
      </button>
    </div>
  </Transition>
</template>

<style lang="less" scoped>
.side-item {
  display: flex;
  width: 100%;
  align-items: center;
  background: transparent;
  flex: 0 0 40px;
  padding: 0 8px;
  color: #666;
  font-size: 15px;
  transition-property: background, color;
  transition-duration: 0.3s;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
  user-select: none;
  &.active,
  &:hover {
    color: #6c6cc9;
    background: #e7eaed;
  }
  &.disabled {
    cursor: not-allowed;
    color: #999;
    &:hover {
      color: #999;
      background: transparent;
    }
  }
}
.add-input {
  width: 100%;
  padding: 7px;
  padding-left: 28px;
  border: 1px solid #6c6cc9;
  border-radius: 4px;
  font-size: 15px;
  transition: all 0.3s;
  margin-bottom: 4px;
  line-height: 22px;
  background-color: #fff;
  &:focus {
    outline: none;
    border-color: #6c6cc9;
    box-shadow: 0 0 0 1px #6c6cc960;
  }
}
.btn {
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
</style>
