<script setup lang="ts">
import logo from "../assets/logo.png";
import {ref} from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { useStatus } from "../stores/status";

import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";


    
const userStore = useUserStore();
const userStatus = useStatus();
const router = useRouter();

const name = ref('');
const email = ref(userStatus.email || '');
const password = ref('');
const repeatPassword = ref('');
const loading = ref(false);
const error = ref("");


const createUser = async () => {
    if(!name.value || !email.value || !password.value || !repeatPassword.value) {
            error.value = 'There are missing data';
            return;
    }

    loading.value = true;
    error.value = '';

    try {  
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/register`,
            {
                name: name.value, 
                email: email.value,
                password: password.value,
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
            <h3>Register Form</h3>

            <!-- ENTER EMAIL -->
            <InputField type="text"
             placeholder="Enter your Email"
             v-model="email" 
            @blur=""/>    

            <!-- ENTER NAME -->
            <InputField type="text"
             placeholder="Enter your Name"
             v-model="name" 
            @blur=""/>

            <!-- ENTER PASSOWRD -->
            <InputField type="password"
             placeholder="Create a strong password"
             v-model="password"
            @blur=""/>        

            <!-- REPEAT PASSWORD -->
            <InputField type="password"
             placeholder="Type your password again"
             v-model="repeatPassword" 
            @blur=""/>

            <!-- REGISTER USER -->
            <Button :disabled="loading"
             onLoading='Creating your account...'
             onActive='Register'
            @click="createUser" />

            <!-- SHOW ERROR -IF FOUND -->
            <Error :error="error" />
    
        </FormWrapper>
</template>

<style scoped>
</style>