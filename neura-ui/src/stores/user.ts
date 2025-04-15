import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state:() => ({
        userId: null as string | null,
        name: null as string | null, 
        email: null as string | null
    }),
    actions: {
        setUser(data: {userId: string; name: string; email: string}){
            this.userId = data.userId;
            this.name = data.name;
            this.email = data.email;
        }, 
        logout() {
            this.userId = null; 
            this.name = null;
            this.email = null;
        }
    },
    persist: true // keeps user loggedin across page reloads
})