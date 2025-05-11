<script setup lang="ts">
import logo from "../assets/logo.png";
import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";
import Paragraph from "./Forms/Paragraph.vue";


import {ref, onBeforeMount} from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import { useRouter } from 'vue-router';
import { useStatus } from "../stores/status";
import { capitalize } from 'vue';
    

    
const userStore = useUserStore();
const userstatus = useStatus();
const router = useRouter();

const email = ref(userstatus.email || '');
const password = ref('');
const loading = ref(false);
const error = ref("");

const validateEmail = async () :Promise<string> => {
    if(!email.value) return error.value = "Email is required";
    if(email.value.length < 5) return error.value = "Email is too short";

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
                    email: email.value.toLowerCase(), 
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
            Enter your password
        </h1>
        

        <!-- EMAIL -->
        <InputField type="email"
                label ="Email"
             v-model="email" 
            @handleError="validateEmail">
            <ion-icon name="mail"></ion-icon>
            </InputField>

        <!-- PASSWORD -->
        <InputField type="password"
               label ="password"
           v-model="password" 
        @handleError="validateEmail">
        <ion-icon name="lock-closed"></ion-icon>
        </InputField>

        <!-- SUBMIT -->
        <Button :disabled="loading"
        onLoading='logging you in...'
        onActive='Start Chatting'
        @click="loginUser" />

        <!-- ERROR -->
        <Error :error="error" />

        <!-- SIGN UP -->
         <Paragraph> 
            <p>Don't have an account? <router-link to="/create-user">Sign Up</router-link></p>
        </Paragraph>
    </FormWrapper>
</template>

<style scoped>
</style>