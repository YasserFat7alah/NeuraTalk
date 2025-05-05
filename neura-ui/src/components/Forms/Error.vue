<script setup lang="ts">
import { defineProps } from 'vue';

defineProps({
    error: {
        type: String,
        default: '',
    },
})
</script>

<template>
    <p v-if="error" class="text-red-400 text-center mt-2">
        {{ error }}
    </p>
</template>


<style scoped></style>