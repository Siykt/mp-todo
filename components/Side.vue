<script setup lang="ts">
import { useSidesStore } from '~/lib/hooks/useTodoStore';

const { init, sides, activeSide, upsetSide } = useSidesStore();

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

init();
onMounted(() => {
  sidesRef.value?.scroll({ top: 0, behavior: 'smooth' });
});
</script>
<template>
  <div class="w-230px flex flex-col h-full bg-#f3f4f6 rounded-md py2 items-start min-h-0">
    <div ref="sidesRef" class="flex-1 flex flex-col p2 relative w-full overflow-hidden overflow-y-auto sides">
      <TransitionGroup name="list">
        <div
          v-for="side in sides"
          :key="side.id"
          class="side-item"
          :class="{ active: activeSide.id === side.id }"
          @click="activeSide = side"
        >
          <i class="mdi:bookshelf"></i>
          <span class="ml-4px">{{ side.title }}</span>
          <span v-if="side.total" class="ml-auto">{{ side.total }}</span>
        </div>
        <div v-if="adding" class="relative" key="addInput">
          <i class="mdi:plus absolute top-50% translate-y--50% text-#6c6cc9 left-2"></i>
          <input
            ref="addInputRef"
            autofocus
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
    <div class="flex flex-col py2 px4">
      <button class="btn" @click="showAddInput">
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
  width: 100%;
  align-items: center;
  background: transparent;
  padding: 8px;
  color: #666;
  font-size: 15px;
  transition: all 0.3s;
  cursor: pointer;
  border-radius: 4px;
  line-height: 22px;
  margin-bottom: 4px;
  user-select: none;
  &.active,
  &:hover {
    color: #6c6cc9;
    background: #e7eaed;
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
