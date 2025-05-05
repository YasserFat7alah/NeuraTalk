<script setup lang="ts">
import logo from "../assets/logo.png";
import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";


import {ref} from 'vue';
    import axios from 'axios';
    import { useUserStore } from '../stores/user';
    import { useRouter } from 'vue-router';
    
    

    
    const userStore = useUserStore();
    const router = useRouter();

    const name = ref('');
    const email = ref('');
    const loading = ref(false);
    const error = ref("");


    const createUser = async () => {
        if(!name.value || !email.value) {
            error.value = 'name and email are required';
            return;
        }

        loading.value = true;
        error.value = '';

        try {  
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/register-user`,
                {
                    name: name.value, 
                    email: email.value
                });
            
            userStore.setUser({
                userId: data.userId,
                name: data.name,
                email: data.email
            });

            router.push('/chat');
            
        } catch (err) {
            error.value = 'Something went wrong. Please try again.';
            console.error(err);
        } finally {
            loading.value = false;

        }

    }
</script>

<template>
    <FormWrapper>
         <img :src="logo" alt="NeuraTalk logo" class="mx-auto w-24 h-24 mb-4">
        <h1 class="text-2xl font-semibold mb-4 text-center">
            Welcome to NeuraTalk
        </h1>

        <input type="text" class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            placeholder="Name" v-model="name"/>
        <input type="text" class="w-full p-2 mb-2 bg-gray-700 text-white rounded-lg focus:outline-none"
            placeholder="Email" v-model="email"/>
        <button class="w-full p-2 mb-2 bg-blue-500 rounded-lg" :disabled="loading" @click="createUser">
            {{ loading ? 'logging in...' : 'Start Chatting'}}
        </button>
        <p v-if="error" class="text-red-400 text-center mt-2">{{ error }}</p>
    </FormWrapper>
</template>

<style scoped>
</style>