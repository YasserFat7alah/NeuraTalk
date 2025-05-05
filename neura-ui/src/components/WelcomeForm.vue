<script setup lang="ts">
import logo from "../assets/logo.png";
import InputField from "./Forms/InputField.vue";

import {ref} from 'vue';
    import axios from 'axios';
    import { useStatus } from '../stores/status';
    import { useRouter } from 'vue-router';
import FormWrapper from "./Forms/FormWrapper.vue";
import Button from "./Forms/Button.vue";
import Error from "./Forms/Error.vue";
    
    

    
    const userStatus = useStatus();
    const router = useRouter();

    const email = ref('');
    const status = ref ('');
    const loading = ref(false);
    const error = ref("");

    const validateEmail = async () => {
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

        loading.value = true;
        error.value = '';

        try {  
            const { data } = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/check`,
                {
                   email: email.value,
                });
            
            userStatus.setStatus({
                status: data.status,
                email: email.value
            });

            if (userStatus.status == '0' ) {
                console.log(status.value);
                router.push('/register-user');
            } else if (userStatus.status == '1' ) {
                console.log(status.value);
                router.push('/update-user');
            } else if (userStatus.status == '2' ) {
                console.log(status.value);
                router.push('/login-user');
            }
            
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


            <InputField type="text"
             placeholder="Enter your Email"
             v-model="email" 
            @blur="validateEmail"/>

            <Button :disabled="loading"
             onLoading="Please wait ..."
             onActive="Continue"
            @click="createStatus" />


            <Error :error="error" />
    </FormWrapper>
</template>

<style scoped>
</style>