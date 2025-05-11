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
    <div class="comment text-neutral-300">
        <p>
        <slot />
        </p>
    </div>
</template>


<style scoped>
.comment {
    font-size: 0.9em;
    text-align: center;
    font-weight: 500;
    margin: 25px 0 10px;
}


</style>