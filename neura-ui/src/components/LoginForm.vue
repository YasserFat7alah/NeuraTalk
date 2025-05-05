<script setup lang="ts">
import logo from "../assets/logo.png";
import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";


import {ref, onBeforeMount} from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { useStatus } from "../stores/status";
    
    

    
const userStore = useUserStore();
const userstatus = useStatus();
const router = useRouter();

const email = ref(userstatus.email || '');
const password = ref('');
const loading = ref(false);
const error = ref("");

const validateEmail = async () :Promise<string> => {
    const validEmail =email.value.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if(!validEmail) return error.value = "This is not a valid email";
    return error.value = '';
}

    const loginUser = async () => {
        if(!password.value || !email.value) {
            error.value = 'Missing data!';
            return;
        }

        if(error.value) return;


        loading.value = true;
        error.value = '';

        try {  
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/login`,
                {
                    password: password.value, 
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

onBeforeMount(() => { 
    if(userStore.userId) { router.push('/chat'); }  
});
</script>

<template>
    <FormWrapper>
         <img :src="logo" alt="NeuraTalk logo" class="mx-auto w-24 h-24 mb-4">
        <h1 class="text-2xl font-semibold mb-4 text-center">
            Welcome to NeuraTalk
        </h1>
        <h3>Login Form</h3>

        <InputField type="text" 
        placeholder="Enter your email"
        v-model="email"
        @blur="validateEmail"/>
        <InputField type="password" 
        placeholder="Enter your password"
        v-model="password" />

        <Button :disabled="loading"
        onLoading='logging you in...'
        onActive='Start Chatting'
        @click="loginUser" />

        
        <Error :error="error" />
    </FormWrapper>
</template>

<style scoped>
</style>