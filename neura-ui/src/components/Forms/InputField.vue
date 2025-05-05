<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: String,
  placeholder: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  inputValue.value = val;
});
</script>

<template>
    <input  class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
    :placeholder="placeholder" v-model="inputValue"
    @input="$emit('update:modelValue', inputValue)"/>
</template>


<style scoped></style>