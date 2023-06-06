<script setup lang="ts">
import { throttle } from 'lodash';
import { useEventListener } from '@vueuse/core';

interface AInputProps {
  modelValue?: any;
  placeholder?: string;
  options: { label: string; value: any }[];
}

defineProps<AInputProps>();
const emits = defineEmits(['update:modelValue', 'blur', 'focus', 'change']);

const inputRef = ref<HTMLInputElement>();
const focus = () => {
  inputRef.value?.focus();
};
const blur = () => {
  inputRef.value?.blur();
};

const selectWrapRef = ref<HTMLDivElement>();
const selectRect = ref<DOMRect>();
const selectValue = ref<any>();
const selectedLabel = ref('');
const show = ref(false);
const open = () => {
  selectRect.value = selectWrapRef.value?.getBoundingClientRect();
  show.value = true;
};

const handleSelect = ({ value, label }: { label: string; value: any }) => {
  selectValue.value = value;
  selectedLabel.value = label;
  show.value = false;
  emits('update:modelValue', value);
};

const handleScroll = throttle((e: Event) => {
  if (!show.value) return;
  const el = e.target as HTMLElement;
  if (selectWrapRef.value && el.contains(selectWrapRef.value)) {
    selectRect.value = selectWrapRef.value?.getBoundingClientRect();
  }
}, 10);

defineExpose({ focus, blur, open });
onMounted(() => {
  useEventListener('click', e => {
    if (show.value && !selectWrapRef.value?.contains(e.target as Element)) show.value = false;
  });
  useEventListener('keydown', e => {
    if (show.value && e.key === 'Escape') show.value = false;
  });
  window.addEventListener('scroll', handleScroll, true);
});
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll, true);
});
</script>
<template>
  <div ref="selectWrapRef" class="select" @click="open">
    <div class="selection">
      <span v-if="selectedLabel">{{ selectedLabel }}</span>
      <span v-else class="opacity-60">{{ placeholder }}</span>
    </div>
    <i class="mdi:chevron-up text-16px transition" :class="{ 'transform-rotate-180deg': show }" />
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectRect && show" class="select-popover">
          <div
            class="select-popover-inner"
            :style="{
              width: selectRect.width + 'px',
              top: selectRect.y + selectRect.height + 4 + 'px',
              left: selectRect.left + 'px',
            }"
          >
            <div
              class="select-popover-item"
              v-for="(option, i) in options"
              :key="`${i}-${option.value}`"
              @click="handleSelect(option)"
            >
              <i
                class="mdi:check-bold text-16px mr-2 text-12px text-#333"
                :style="{
                  opacity: selectValue === option.value ? 1 : 0,
                }"
              />
              <span :class="{ 'font-600': selectValue === option.value }">{{ option.label }}</span>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style lang="less" scoped>
.select {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  padding: 9px 12px;
  cursor: pointer;
  max-height: 300px;
  transform: scale(1, 1);
  outline: none;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease-in-out 0s;
  border-radius: 8px;
  font-size: 14px;
  opacity: 1;
  color: rgb(66, 82, 110);
  .selection {
    width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.select-popover {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  .select-popover-inner {
    position: absolute;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1);
    z-index: 99;
    border-radius: 8px;
    padding: 8px 0px;
    background: rgb(255, 255, 255);
  }

  .select-popover-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    background: rgb(255, 255, 255);
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
    color: rgb(28, 31, 35);
    transition: all 0.3s ease-in-out 0s;
    &:hover {
      background: rgba(46, 50, 56, 0.05);
    }
  }
}
</style>
