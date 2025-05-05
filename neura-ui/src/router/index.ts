import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import ChatView from "../views/ChatView.vue";
import RegisterView from "../views/RegisterView.vue";
import UpdateView from "../views/UpdateView.vue";

const routes =[
    {path: '/', component: HomeView},
    {path: '/create-user', component: RegisterView},
    {path: '/log-in', component: LoginView},
    {path: '/update-password', component: UpdateView},
    
    {path:'/chat', component: ChatView}
];

export const router = createRouter({
    history: createWebHistory(),
     routes
}
)