import { defineStore } from 'pinia';

export const useStatus = defineStore('status', {
    state:() => ({
        status: null as string | null,
        email: null as string | null,
    }),
    actions: {
        setStatus(data: {status :string; email :string;}){
            this.status = data.status;
            this.email = data.email;
        },
        clearStatus() {
            this.status = null;
            this.email = null;
        }
    },
    persist: true // keeps user loggedin across page reloads
})