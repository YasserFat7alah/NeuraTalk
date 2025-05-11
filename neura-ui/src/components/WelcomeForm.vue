<script setup lang="ts">
import logo from "../assets/logo.png";


import {ref, onBeforeMount} from 'vue';
import axios from 'axios';
import { useUserStore} from '../stores/user';
import { useStatus } from '../stores/status';
import { useRouter } from 'vue-router';

import FormWrapper from "./Forms/FormWrapper.vue";
import InputField from "./Forms/InputField.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";
import Paragraph from "./Forms/Paragraph.vue";   
    

const userStore = useUserStore();
const userStatus = useStatus();
const router = useRouter();

const email = ref('');
const status = ref ('');
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

const createStatus = async () => {
    if( !email.value) {
        error.value = 'email is required';
        return;
    }

    if(error.value) return;


    loading.value = true;
    error.value = '';

    try {  
        const { data } = await axios.post(
            `${import.meta.env.VITE_API_URL}/user/check`,
            {
               email: email.value.toLowerCase().trim(),
            });
            
        userStatus.setStatus({
            status: data.status,
            email: email.value.toLowerCase().trim(),
        });

        if (userStatus.status == '0' ) {
            console.log(status.value);
            router.push('/create-user');
        } else if (userStatus.status == '1' ) {
            console.log(status.value);
            router.push('/update-password');
        } else if (userStatus.status == '2' ) {
            console.log(status.value);
            router.push('/log-in');
        }
            
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


            <InputField type="email"
                placeholder ="Email"
             v-model="email" 
            @handleError="validateEmail">
            <ion-icon name="mail"></ion-icon>
            </InputField>

            <Button :disabled="loading"
             onLoading="Please wait ..."
             onActive="Continue"
            @click="createStatus" />


            <Error :error="error" />

            <Paragraph >
                More about <a href="">Us</a>.
            </Paragraph>
    </FormWrapper>
</template>

<style scoped>
</style>