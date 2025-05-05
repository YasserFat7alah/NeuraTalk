<script setup lang="ts">

defineProps({
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
  variant: { type: String, default: 'primary' }, // e.g. primary, secondary, danger
  size: { type: String, default: 'md' },         // e.g. sm, md, lg
  disabled: { type: Boolean, default: false },
  onLoading: {type: String, default: 'Loading ...'},
  onActive: {type: String, default: 'Submit'},
});
</script>

<template>
    <button class="w-full p-2 mb-2 bg-blue-500 rounded-lg" :type='type' :disabled="disabled">
        {{ disabled ? `${onLoading}` : `${onActive}` }}
    </button>
</template>


<style scoped></style>