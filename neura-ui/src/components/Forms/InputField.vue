<script setup lang="ts">
import { ref, watch } from 'vue';
import { capitalize } from 'vue';

const props = defineProps({
  modelValue: String,
  type: { type: String, default: 'text' },
  label: { type: String, default: 'Email' },
  error: String,
});

const emit = defineEmits(['update:modelValue', 'handleError']);

const inputValue = ref(props.modelValue);


watch(() => props.modelValue, (val) => {
  inputValue.value = val;
});
</script>

<template>


  <div class=" relative w-full h-13 bg-transparent border-b-2 border-neutral-200 my-8">

    <!-- Input Field -->
    <input :type="type" required placeholder=" " v-model="inputValue"
    @input="$emit('update:modelValue', inputValue)"
    @blur="$emit('handleError', inputValue)"
    
    
    class=" peer 
    /* Base styles */
    w-full h-full 
    bg-transparent border-none outline-none 
    text-base text-neutral-200 pl-1 pr-9

    /* Animation */
    transition-discrete duration-300
    
    /* Input states */
     invalid:not-focus:text-error " >
     
    <!-- icon  ex: @ -->
    <span class="absolute right-2 translate-y-1/2 text-[1.2em]
     text-neutral-200  size-[1.2em] 
     /* Animation */
        transition-discrete duration-300 

     peer-focus:text-secondary-light
     peer-valid:text-secondary-light
     peer-target:text-secondary-light
     peer-invalid:peer-focus:text-secondary-light"
      :class="inputValue ? 'peer-invalid:peer-not-focus:text-error' : ''">
      <slot />
    </span>
    <!-- label  ex: Name -->
    <label class="
        /* Positioning */
        absolute top-1/2 left-1.25 -translate-y-1/2
        
        /* Base styles */
        font-semibold text-base text-neutral-200
        pointer-events-none
        
        /* Animation */
        transition-discrete duration-300 
        
        /* Label movement states */
        
        peer-focus:-top-[5px]
        peer-valid:-top-[5px]
        peer-target:-top-[5px]
        peer-[&:not(:placeholder-shown)]:-top-[5px]
        
        /* Color states */
        
        peer-focus:text-secondary-light
        peer-valid:text-secondary-light
        peer-target:text-secondary-light
        peer-invalid:peer-focus:text-secondary-light
      
        "
        :class="inputValue ? 'peer-invalid:peer-not-focus:text-error' : ''  "
        >
      <!-- Label to show -->
      {{ capitalize(label) }}
    </label>
  </div>
</template>


<style scoped>











</style>