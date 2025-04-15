<script setup lang="ts">
    import { useRouter } from 'vue-router';
    import { useUserStore } from '../stores/user';

    import hLogo from '../assets/horizontal.png';

    const userStore =useUserStore();
    const router = useRouter();

    const logout = ()=>{
        userStore.logout();
        router.push('/');
    }
 </script>

 <template>
    <div class="py-4 px-4 bg-gray-800 shadow-md flex justify-between items-center">
        <img :src="hLogo" alt="NeuraTalk logo" class="w-30 h-8">
        <h1 class="text-lg font-semibold hidden">Chat AI</h1>
        <button class="text-gray-400 hover:text-white" @click="logout">
            Logout</button>
    </div>
    
 </template>