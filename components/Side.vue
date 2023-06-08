<script setup lang="ts">
import { d } from 'vue-bundle-renderer/dist/types-b178c7f3';
import { useToast } from '~/lib/hooks/useToast';
import { useSidesStore } from '~/lib/hooks/useTodoStore';

const { init, sides, activeSide, upsetSide, deleteSide } = useSidesStore();

const adding = ref(false);
const sidesRef = ref<HTMLDivElement>();
const addInputRef = ref<HTMLInputElement>();
const showAddInput = () => {
  adding.value = true;
  nextTick(() => {
    if (!sidesRef.value) return;
    sidesRef.value.scroll({ top: sidesRef.value.scrollHeight, behavior: 'smooth' });
    // focus会导致滚动状态停止, 所以需要动态的调整focus的时机
    // https://stackoverflow.com/questions/64611389/scroll-duration-for-behaviour-smooth-in-different-browsers
    setTimeout(() => {
      addInputRef.value?.focus();
    }, (sidesRef.value.scrollHeight - sidesRef.value.scrollTop) / 3 + 100);
  });
};

const sideTitle = ref('');
const addSide = async () => {
  if (sideTitle.value) {
    activeSide.value = await upsetSide({ title: sideTitle.value });
    sideTitle.value = '';
  }
  adding.value = false;
  nextTick(() => {
    sidesRef.value?.scroll({ top: sidesRef.value?.scrollHeight, behavior: 'smooth' });
  });
};

const isShowSettings = useState('isShowSettings', () => false);

const editingSideId = ref('');
const handleEditSide = (sideId: string, e?: MouseEvent) => {
  if ((e?.target as HTMLElement)?.tagName === 'INPUT') return;
  editingSideId.value = sideId;
  nextTick(() => {
    const input = document.querySelector('.side-item input') as HTMLInputElement;
    input.focus();
    input.select();
  });
};

const toast = useToast();
const chooseSideId = ref('');
const menuRef = ref<HTMLDivElement>();
const showMenu = ref(false);
const position = ref({ x: 0, y: 0 });
const handleCloseMenu = (e?: MouseEvent) => {
  if (e && menuRef.value?.contains(e.target as Node)) return;
  showMenu.value = false;
  chooseSideId.value = '';
  document.removeEventListener('click', handleCloseMenu);
  document.removeEventListener('dblclick', handleCloseMenu);
  document.removeEventListener('contextmenu', handleCloseMenu);
};
const handleShowMenu = (e: MouseEvent, sideId: string) => {
  chooseSideId.value = sideId;
  e.stopPropagation();
  e.preventDefault();
  showMenu.value = true;
  position.value = { x: e.clientX, y: e.clientY };
  document.addEventListener('click', handleCloseMenu, true);
  document.addEventListener('dblclick', handleCloseMenu, true);
  document.addEventListener('contextmenu', handleCloseMenu, true);
};

const handleDeleteSide = () => {
  if (!chooseSideId.value) return;
  if (sides.value.length === 1) {
    toast.info('至少保留一个分组');
    handleCloseMenu();
    return;
  }
  deleteSide(chooseSideId.value);
  handleCloseMenu();
};

init();
onMounted(() => {
  sidesRef.value?.scroll({ top: 0, behavior: 'smooth' });
});
</script>
<template>
  <div class="w-230px flex flex-col h-full bg-#f3f4f6 rounded-md py2 items-start min-h-0">
    <div ref="sidesRef" class="flex-1 flex flex-col px2 relative w-full overflow-hidden overflow-y-auto">
      <TransitionGroup name="list">
        <div
          v-for="side in sides"
          :key="side.id"
          class="side-item"
          :class="{ active: activeSide.id === side.id, disabled: isShowSettings, '!p0': editingSideId === side.id }"
          @click="!isShowSettings && (activeSide = side)"
          @dblclick="handleEditSide(side.id, $event)"
          @contextmenu="handleShowMenu($event, side.id)"
        >
          <template v-if="editingSideId !== side.id">
            <i class="mdi:bookshelf"></i>
            <span v-if="editingSideId !== side.id" class="ml-4px flex-1">{{ side.title }}</span>
            <span v-if="side.total" class="ml-auto">{{ side.total }}</span>
          </template>
          <input
            v-else
            class="add-input !mb0"
            v-model="side.title"
            @blur="upsetSide(side), (editingSideId = '')"
            @keyup.enter="upsetSide(side), (editingSideId = '')"
          />
        </div>
        <div v-if="adding" class="relative" key="addInput">
          <i class="mdi:plus absolute top-50% translate-y--50% text-#6c6cc9 left-2"></i>
          <input
            ref="addInputRef"
            class="add-input"
            v-model="sideTitle"
            @blur="addSide"
            @keyup.enter="addSide"
            placeholder="添加一个分组"
          />
        </div>
      </TransitionGroup>
    </div>
    <div class="w-full h-1px my2 px-2">
      <div class="w-full h-full bg-#ddd"></div>
    </div>
    <div class="flex flex-col py2 px4 w-full">
      <button key="plus" class="btn" @click="showAddInput">
        <i class="mdi:plus"></i>
        添加分组
      </button>
      <button v-if="!isShowSettings" key="settings" class="btn" @click="isShowSettings = true">
        <i class="mdi:cog-outline"></i>
        设置
      </button>
      <button v-else key="todo" class="btn" @click="isShowSettings = false">
        <i class="mdi:format-list-group-plus"></i>
        TODOS
      </button>
    </div>
  </div>
  <Transition name="fade">
    <div
      v-if="showMenu"
      ref="menuRef"
      :style="{
        left: position.x + 'px',
        top: position.y + 'px',
      }"
      class="bg-#fff w86px h70px rounded fixed z-10 shadow-lg flex flex-col justify-center transition-property-all transition-duration-200"
    >
      <button class="btn !px2 !hover:bg-#e7eaed" @click="handleEditSide(chooseSideId), handleCloseMenu()">
        <i class="mdi:playlist-edit"></i>
        编辑
      </button>
      <button class="btn !px2 !hover:bg-#e7eaed" @click="handleDeleteSide()">
        <i class="mdi:delete-sweep-outline"></i>
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
