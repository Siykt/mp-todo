<script setup lang="ts">
interface AInputProps {
  modelValue?: boolean;
}

defineProps<AInputProps>();
defineEmits(['update:modelValue', 'change']);
</script>
<template>
  <div
    class="form-switch-input"
    :class="{ checked: modelValue }"
    @click="$emit('update:modelValue', !modelValue), $emit('change', !modelValue)"
  >
    <input :checked="!!modelValue" type="checkbox" />
    <label for="SMTPTLS"></label>
  </div>
</template>

<style lang="less" scoped>
.form-switch-input {
  box-sizing: border-box;
  display: inline-block;
  border-radius: 12px;
  border: 1px solid transparent;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s ease-in 0s;
  width: 32px;
  height: 18px;
  background-color: rgba(46, 50, 56, 0.2);
  label {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 0 1px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    border-radius: 9px;
    background-color: #fff;
    box-sizing: border-box;
    position: absolute;
    left: 0;
    right: auto;
    transition: transform 0.2s ease-in-out, width 0.2s ease-in-out;
    width: 12px;
    height: 12px;
    top: 2px;
    transform: translateX(1px);
  }
  input {
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: inherit;
    pointer-events: auto;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
  }
  &.checked {
    background-color: #6c6cc9;
    label {
      transform: translateX(16px);
    }
  }
}
</style>
