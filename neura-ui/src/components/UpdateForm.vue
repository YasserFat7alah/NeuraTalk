<script setup lang="ts">
import logo from "../assets/logo.png";


import {ref, onBeforeMount, capitalize} from 'vue';
import axios from 'axios';
import { useUserStore} from '../stores/user';
import { useStatus } from '../stores/status';
import { useRouter } from 'vue-router';


import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";
    
    

const userStore = useUserStore();
const userStatus = useStatus();
const router = useRouter();

const email = ref(userStatus.email || '');
const name = ref('');
const password = ref('');
const repeatedPassword = ref('');

const loading = ref(false);
const error = ref("");

const validateEmail = async () => {
    const validEmail =email.value.toLowerCase().match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    if(!validEmail) return error.value = "This is not a valid email";
    return error.value = '';
}

const updateUser = async () :Promise<any> => {
    if(!email || !name ) {
        return error.value = "name and email are required to prove its your account"
    };

    if(error.value) return;

    loading.value = true;
    error.value = '';

    try {  
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/update`,
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
                Welcome Back!
            </h1>
            <p> Due to some changes we need you to create a strong password</p>


            <!-- ENTER EMAIL -->
            <InputField type="text"
             placeholder="Enter your Email"
             v-model="email" 
            @blur="validateEmail"/>    

            <!-- ENTER NAME -->
            <InputField type="text"
             placeholder="Enter your Name"
             v-model="name" 
            @blur=""/>

            <!-- ENTER PASSOWRD -->
            <InputField type="password"
             v-model="password"
            @blur=""/>        

            <!-- REPEAT PASSWORD -->
            <InputField type="password"
             placeholder="Type your password again"
             v-model="repeatedPassword" 
            @blur=""/>

            <!-- REGISTER USER -->
            <Button :disabled="loading"
             onLoading='Updating you account...'
             onActive='Continue Chatting'
            @click="updateUser" />

            <!-- SHOW ERROR -IF FOUND -->
            <Error :error="error" />
    
        </FormWrapper>
</template>

<style scoped>
</style>