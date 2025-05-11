<script setup lang="ts">
import logo from "../assets/logo.png";
import {ref, onBeforeMount} from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { useStatus } from "../stores/status";
import { capitalize } from 'vue';

import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";
import Paragraph from "./Forms/Paragraph.vue";


    
const userStore = useUserStore();
const userStatus = useStatus();
const router = useRouter();

const name = ref('');
const email = ref(userStatus.email || '');
const password = ref('');
const repeatPassword = ref('');
const loading = ref(false);
const error = ref("");

const validateEmail = async () :Promise<string> => {
    const validEmail =email.value.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if(!validEmail) return error.value = "This is not a valid email";
    return error.value = '';
}

const createUser = async () => {
    if(!name.value || !email.value || !password.value || !repeatPassword.value) {
            error.value = 'There are missing data';
            return;
    }
    if(error.value) return;


    loading.value = true;
    error.value = '';

    try {  
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/register`,
            {
                name: capitalize(name.value), 
                email: email.value.toLowerCase(),
                password: password.value,
            });
            
        userStore.setUser({
            userId: data.userId,
            name: capitalize(data.name),
            email: data.email.toLowerCase(),
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
            Create Account
        </h1>
        
        
        <!-- EMAIL -->
        <InputField type="email"
        label ="Email"
        v-model="email" 
        @handleError="validateEmail">
        <ion-icon name="mail"></ion-icon>
        </InputField>
    
        <!-- Name -->
        <InputField type="text"
            label ="Name"
         v-model="name" >
        <ion-icon name="person"></ion-icon>
        </InputField>

        <!-- PASSWORD -->
        <InputField type="password"
               label ="password"
           v-model="password" 
        >
        <ion-icon name="lock-closed"></ion-icon>
        </InputField>

        <!-- REPEAT PASSWORD -->
        <InputField type="password"
               label ="repeat password"
           v-model="repeatPassword" 
        >
        <ion-icon name="repeat"></ion-icon>
        </InputField>

        <!-- SUBMIT -->
        <Button :disabled="loading"
        onLoading='logging you in...'
        onActive='Create Account'
        @click="createUser" />

        <!-- ERROR -->
        <Error :error="error" />

        <!-- SIGN UP -->
         <Paragraph> 
            <p>Already have an account? <router-link to="/log-in">Log In</router-link></p>
        </Paragraph>
    </FormWrapper>
</template>

<style scoped>
</style>