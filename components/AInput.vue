<script setup lang="ts">
interface AInputProps {
  modelValue?: any;
  placeholder?: string;
  type?: string;
  rows?: number;
}

const inputRef = ref<HTMLInputElement>();
const focus = () => {
  inputRef.value?.focus();
};
const blur = () => {
  inputRef.value?.blur();
};

withDefaults(defineProps<AInputProps>(), {
  type: 'text',
  rows: 3,
});
defineEmits(['update:modelValue', 'blur', 'focus', 'change']);
defineExpose({ focus, blur });
</script>
<template>
  <div class="form-input">
    <input
      v-if="type !== 'textarea'"
      ref="inputRef"
      class="input"
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @change="$emit('change', $event)"
      :placeholder="placeholder"
      :type="type"
    />
    <textarea
      v-else
      :value="modelValue"
      ref="inputRef"
      class="input"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
      @change="$emit('change', $event)"
      :placeholder="placeholder"
      :type="type"
      :rows="rows"
    />
    <label />
  </div>
</template>

<style lang="less" scoped>
.form-input {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  padding: 9px 0px;
  label {
    position: absolute;
    inset: 0px;
    border: 1px solid rgba(0, 0, 0, 0.08);
    pointer-events: none;
    transition: all 0.3s ease-in-out 0s;
    border-radius: 8px;
  }
  .input {
    margin: 0px;
    border: none;
    border-radius: 0px;
    background: transparent;
    appearance: none;
    font-size: 14px;
    padding: 0px 16px;
    flex: 1 1 0%;
    height: 100%;
    color: rgb(66, 82, 110);
    resize: none;
    &:focus {
      outline: none;
      & + label {
        border-color: #6c6cc9;
      }
    }
  }
}
</style>
